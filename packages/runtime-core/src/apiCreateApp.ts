import { createVnode } from "./vnode";

export function createAppAPI(render) {
  return function createApp(rootComponent, rootProps) {
    const app = {
      _props: rootProps,
      _rootComponent: rootComponent,
      _container: null,
      mount(container) {
        // c创建虚拟节点
        // 根据虚拟ie创建真实dom

        const vnode = createVnode(rootComponent, rootProps);
        //   条用render
        render(vnode, container);
        app._container = container;
      },
    };
    return app;
  };
}
