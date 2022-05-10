import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export function reactive(target: any) {
  return createReactiveObject(target, false, mutableHandlers);
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}
export function readonly(target: any) {
  return createReactiveObject(target, true, readonlyHandlers);
}
export function shallowReadonly(target: any) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

const reactiveMap = new WeakMap(); //会自动触发垃圾回收机制key只能是对象
const readonlyMap = new WeakMap();
//柯里化
export function createReactiveObject(target, isReadonly, baseHandlers) {
  //如果目标不是对象就无法拦截
  if (!isObject(target)) return;
  // 如果某个对象被代理了，就不需要代理了
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;

  const existProxy = proxyMap.get(target);
  if (existProxy) {
    return existProxy; //已经被代理，直接返回
  }
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy); //将要代理的对象和代理结果缓存起来
  return proxy;
}
