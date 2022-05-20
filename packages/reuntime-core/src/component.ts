import { isFunction, isObject, ShapeFlags } from "@vue/shared";
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

  // 如果没有setup
  if (setup) {
    let setupContext = createContext(instance);
    const setupResult = setup(instance.props, setupContext);
    handelSetupResult(instance, setupResult);
  } else {
    // 完成组件的启动
    finishComponentSetup(instance);
  }
  // component.render(instance.proxy);
}
function handelSetupResult(instance: any, result: any) {
  if (isFunction(result)) {
    // 如果setup是函数就把函数作为render
    instance.render = result;
  } else if (isObject(result)) {
    // 如果是对象就将对象作为setupstate
    instance.setupState = result;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  let component = instance.type;
  if (!instance.render) {
    if (!component.render && component.template) {
      // 如果没有render有的是template需要编译处理成render
    }
    // 对template进行处理产生render
    instance.render = component.render;
  }
  console.log("setupsState=====", instance);
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
