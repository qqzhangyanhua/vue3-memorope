// 事项响应式的主要get set
// 是不是readonly

import {
  extend,
  isArray,
  isIntegerKey,
  isObject,
  hasOwnProperty,
  hasChanges,
} from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpType } from "./operator";
import { reactive, readonly } from "./reactive";

// 是不是深度的
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);
const readonlyObj = {
  set: (target: any, key: any) => {
    console.log(`key is only readonly ${key}`);
  },
};

const set = createSetter();
const shallowSet = createSetter(true);
export const mutableHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};
export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlyObj
);
export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlyObj
);
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: any, key: any) {
    //   reflect具有返回值
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      //   如果不是只读的需要收集依赖
      console.log("执行effect");
      track(target, TrackOpType.GET, key);
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      //   判断是否是对象
      //vue2是以上过来就递归，vue3是取值的时候递归
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter(isShallow = false) {
  return function set(target: any, key: any, value) {
    const oldValue = target[key];
    let hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwnProperty(target, key);
    if (!hadKey) {
      // 新增
      trigger(target, TrackOpType.ADD, key, value);
    } else if (hasChanges(oldValue, value)) {
      // 修改
      trigger(target, TrackOpType.SET, key, value, oldValue);
    }
    const res = Reflect.set(target, key, value);
    // 当数据更新 通知这里执行
    // 区分是新增的还是修改的
    return res;
  };
}
