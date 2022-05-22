// 创建一个渲染器
// 组件---虚拟dom===真实dom===挂载
import { effect } from "@vue/reactivity";
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { queueJob } from "./scheduler";
import { normalizeVnode, TEXT } from "./vnode";
export function createRenderer(renderOptions) {
  const {
    createElement: hosCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    createText: hostCreateText,
    nextSibling: hostNextSibling,
    patchProp,
    nextTick,
    options: globalOptions,
  } = renderOptions;

  const setupRenderEffect = (instance, container) => {
    // 需要创建一个effect在effect里调用render,属性更新render会重新执行
    effect(
      function componentEffect() {
        // 每一个组件都有一个effect，vue3是组件化更新
        // 区分是更新，还是渲染
        if (!instance.isMounted) {
          // 初次渲染
          let proxyToUse = instance.proxy;
          let subTree = (instance.subTree = instance.render.call(
            proxyToUse,
            proxyToUse
          ));
          // 用render的返回值渲染
          patch(null, subTree, container);
          instance.isMounted = true;
        } else {
          // 更新
          // debugger;
          const prevTree = instance.subTree;
          let proxyToUse = instance.proxy;
          const nextTree = instance.render.call(proxyToUse, proxyToUse);
          patch(prevTree, nextTree, container);
          console.log("更新了", prevTree, nextTree);
        }
      },
      {
        scheduler: queueJob,
      }
    );
    // instance.render();
  };
  const mountComponent = (initVnode, container) => {
    // 挂载
    console.log("挂载的", initVnode, container);
    //   1.创建实例
    const instance = (initVnode.component = createComponentInstance(initVnode));
    //   2挂载在组件实例上
    setupComponent(instance);
    //   3创建一个effect
    setupRenderEffect(instance, container);
  };
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      // 上一次没有节点
      mountComponent(n2, container);
    } else {
      // 组件更新
    }
  };
  const mountChildren = (children, el) => {
    for (let i = 0; i < children.length; i++) {
      const child = normalizeVnode(children[i]);
      patch(null, child, el);
    }
  };
  const mountElement = (vnode, container, anchor) => {
    // 递归渲染
    const { props, shapeFlag, children, type } = vnode;
    const el = (vnode.el = hosCreateElement(type));
    if (props) {
      for (const prop in props) {
        hostPatchProps(el, prop, null, props[prop]);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 文本直接塞进去即可
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 如果是数组
      mountChildren(children, el);
    }
    hostInsert(el, container, anchor);
  };
  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevValue = oldProps[key];
        const nextValue = newProps[key];
        if (prevValue !== nextValue) {
          hostPatchProps(el, key, prevValue, nextValue);
        }
      }
      for (const key in oldProps) {
        // 如果老的props有新的没有
        if (!(key in newProps)) {
          hostPatchProps(el, key, oldProps[key], null);
        }
      }
    }
  };
  const patchKeysChildren = (c1, c2, container) => {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    // 从头开始比
    while (i <= e1 && i < e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameNodeType(n1, n2)) {
        patch(n1, n2, container);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i < e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameNodeType(n1, n2)) {
        patch(n1, n2, container);
      } else {
        break;
      }
      e1--;
      e2--;
    }
  };
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };
  const patchChildren = (n1, n2, container) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const preShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //现在是文本
      // 如果老的是多个孩子，新的是文本
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1); //如果c1包含组件
      }
      // 如果都是文本并且文本不一样直接替换。
      if (c1 !== c2) {
        hostSetElementText(c2, container);
      }
    } else {
      // 现在是元素，上次可能是元素，也可能是文本
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 之前是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //之前是数组，当前也是数组
          patchKeysChildren(c1, c2, container);
        } else {
          // 之前是数组，当前没有children
          unmount(c1); //删除
        }
      } else {
        //上一次是文本
        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 上一次是文本，这次是children
          mountChildren(c2, container);
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    // 元素节点是一样的
    let el = (n1.el = n2.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el);
    // 子元素的比较
    patchChildren(n1, n2, container);
  };
  // 处理元素
  const processElement = (n1, n2, container, anchor) => {
    // 初始化
    if (n1 == null) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2, container);
      // 更新
    }
  };
  // -----------文本处理--------------------------------

  const isSameNodeType = (n1, n2) => {
    return n1.type === n2.type && n1.key == n2.key;
  };
  const unmount = (n1) => {
    //如果是组件调用组件的生命周期
    hostRemove(n1.el);
  };
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      // 创建
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    }
  };
  const patch = (n1, n2, container, anchor = null) => {
    //   针对不同类型进行初始化
    const { shapeFlag, type } = n2;
    if (n1 && !isSameNodeType(n1, n2)) {
      anchor = hostNextSibling(n1.el);
      unmount(n1);
      n1 = null; //重新渲染
    }

    switch (type) {
      case TEXT:
        processText(n1, n2, container);
        break;
      case "Text":
        break;
      case "Comment":
        break;
      case "Static":
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 元素
          processElement(n1, n2, container, anchor);
          console.log("元素");
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          console.log("组件");
          processComponent(n1, n2, container);
        }
    }
  };
  const render = (vnode, container) => {
    //   core的核心，根据不同的虚拟节点渲染
    //   默认调用render ,可能是初始化
    patch(null, vnode, container);
  };
  return {
    createApp: createAppAPI(render), //高阶函数
  };
}
