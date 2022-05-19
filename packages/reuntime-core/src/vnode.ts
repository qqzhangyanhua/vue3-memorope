// 创建虚拟节点

import { isObject, isString, ShapeFlags } from "@vue/shared";

// h()
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
    el: null, //会与真实节点对应起来
    key: props && props.key, //diff算法会用到key
    shapeFlag,
  };
}
