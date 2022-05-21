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
    setElementText: hostSetElementText,
    createText: hostCreateText,
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
          console.log("更新了");
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
  const mountElement = (vnode, container) => {
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
    hostInsert(el, container);
  };
  // 处理元素
  const processElement = (n1, n2, container) => {
    // 初始化
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      // 更新
    }
  };
  // -----------文本处理--------------------------------
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      // 创建
      hostInsert((n2.el = hostCreateText(n2.children)), container);
    }
  };
  const patch = (n1, n2, container) => {
    //   针对不同类型进行初始化
    const { shapeFlag, type } = n2;

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
          processElement(n1, n2, container);
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
