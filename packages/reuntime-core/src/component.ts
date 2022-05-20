import { ShapeFlags } from "@vue/shared";
import { publicInstanceHandler } from "./publicInstanceHandler";

// 组件的所有方法
export function createComponentInstance(vnode) {
  const instance = {
    // 组件的实例
    vnode,
    type: vnode.type,
    props: {},
    attrs: {},
    slots: {},
    ctx: null,
    setupState: {}, //如果返回一个setupState
    isMounted: false, //是否初渲染
  };
  instance.ctx = { _: instance };
  return instance;
}
export function setupComponent(instance) {
  const { type, props, children } = instance.vnode;
  //根据props 解析attrs 和props
  instance.props = props;
  instance.children = children;
  // 判单是不是有状态的组件或者函数组件
  let flag = (instance.vnode.shapeFlags = ShapeFlags.STATEFUL_COMPONENT);
  if (flag) {
    // 现在是一个带状态的组件
    //   调用当前实例的方法
    setupStatefulComponent(instance);
  }
}
function setupStatefulComponent(instance: any) {
  //  1 代理传递给render
  // 2获取组件的类型，拿到组件是setup
  instance.proxy = new Proxy(instance.ctx, publicInstanceHandler as any);
  let component = instance.type;
  let { setup } = component;
  let setupContext = createContext(instance);
  setup(instance.props, setupContext);
  component.render(instance.proxy);
}
function createContext(instance: any) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {},
  };
}
// instance组件的状态
// proxy主要为了render(){}取值方便
