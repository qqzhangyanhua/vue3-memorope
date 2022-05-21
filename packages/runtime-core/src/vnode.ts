// 创建虚拟节点

import { isArray, isObject, isString, ShapeFlags } from "@vue/shared";

// h()
export function isVnode(vnode) {
  return vnode._v_isVnode;
}
export function createVnode(type: any, props, children = null) {
  // 根据type来区分是组件还是元素
  //   给虚拟节点加个type
  // 一个对象来描述具有跨平台
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;
  const vnode = {
    _v_isVnode: true,
    type,
    props,
    children,
    el: null, //会与真实节点对应起来
    key: props && props.key, //diff算法会用到key
    shapeFlag,
    component: null, //组件
  };
  normalizeChildren(vnode, children);
  return vnode;
}
function normalizeChildren(vnode, children: any) {
  let type = 0;
  if (children == null) {
    //    没有孩子
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }
  vnode.shapeFlag |= type;
}
export const TEXT = Symbol("TEXT");
export function normalizeVnode(child) {
  if (isObject(child)) {
    return child;
  }
  return createVnode(TEXT, null, String(child));
}