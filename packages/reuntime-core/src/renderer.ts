// 创建一个渲染器
// 组件---虚拟dom===真实dom===挂载
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
export function createRenderer(renderOptions) {
  const setupRenderEffect = (instance) => {
    // 需要创建一个effect在effect里调用render,属性更新render会重新执行
  };
  const mountComponent = (initVnode, container) => {
    // 挂载
    console.log("挂载的", initVnode, container);
    //   1.创建实例
    const instance = (initVnode.component = createComponentInstance(initVnode));
    //   2挂载在组件实例上
    setupComponent(instance);
    //   3创建一个effect
    setupRenderEffect(instance);
  };
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      // 上一次没有节点
      mountComponent(n2, container);
    } else {
      // 组件更新
    }
  };
  const patch = (n1, n2, container) => {
    //   针对不同类型进行初始化
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) {
      // 元素
      console.log("元素");
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      console.log("组件");
      processComponent(n1, n2, container);
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
