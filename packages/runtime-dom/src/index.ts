// 核心是提供dom=api功能的 操作属性的更新

import { createRenderer } from "@vue/runtime-core";
import { extend } from "@vue/shared";
import { nodeOps } from "./nodeOps"; //对象
import { patchProps } from "./patchProps"; //方法

// 节点操作增删改查

const renderOptions = extend({ patchProps }, nodeOps); //渲染时用到的方法

// vue runtime-core实现了核心方法
export function createApp(rootComponent, rootProps = {}) {
  // const app = {} as any;
  const app: any = createRenderer(renderOptions).createApp(
    rootComponent,
    rootProps
  );
  let { mount } = app;
  app.mount = function (container) {
    //挂载
    //   清空容器
    container = nodeOps.querySelector(container);
    container.innerHTML = "";
    mount(container);
  };
  return app;
}
// runtime-dom   ----runtime-core
export { renderOptions };

export * from "@vue/runtime-core";

// m每个组件都是一个effect

// 组件渲染流程 ===先父后子，执行顺序是深度优先
