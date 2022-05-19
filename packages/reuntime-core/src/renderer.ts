// 创建一个渲染器
// 组件---虚拟dom===真实dom===挂载
import { createAppAPI } from "./apiCreateApp";
export function createRenderer(renderOptions) {
  const render = (vnode, container) => {};
  return {
    createApp: createAppAPI(render), //高阶函数
  };
}
