import { isArray, isObject } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type, propsChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren)) {
        // 如果是虚拟节点
        return createVnode(type, null, [propsChildren]);
      }
      return createVnode(type, propsChildren);
    } else {
      // 如果第二个参数不是对象那么就是孩子
      return createVnode(type, null, propsChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsChildren, children);
  }
}
