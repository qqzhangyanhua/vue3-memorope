import { hasChanges, isArray, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { TrackOpType } from "./operator";
import { reactive } from "./reactive";

export function ref(value) {
  // 可以是对象
  return createRef(value);
}
// 如果是对象就用reactive包裹着，如果不是就是原来的值
const covert = (val) => (isObject(val) ? reactive(val) : val);
class RefImpl {
  public _value: any; //表示声明了没赋值
  // 增加public表示增加在实例了
  public _v_isRef = true;
  constructor(public rawValue: any, public shallow) {
    this._value = shallow ? rawValue : covert(rawValue); //对象变成深度的。
  }
  get value() {
    track(this, TrackOpType.GET, "value");
    return this._value;
  }
  set value(newValue: any) {
    if (hasChanges(newValue, this.rawValue)) {
      this.rawValue = newValue;
      this._value = newValue;
      trigger(this, TrackOpType.SET, "value", newValue);
    }
  }
}
// ref和reactive的区别
function createRef(value: any, shallow = false) {
  return new RefImpl(value, shallow);
}
export function shallowRef(value: any) {
  return createRef(value, true);
}

// 对象变成响应式的
// 将某一个对象的值转成响应式的
export function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}
export function toRefs(object) {
  const res = isArray(object) ? new Array(object.length) : {};
  for (let key in object) {
    res[key] = object[key];
  }
  return res;
}
class ObjectRefImpl {
  public _v_isRef = true;
  constructor(public target: any, public key: any) {}
  get value() {
    return this.target[this.key]; //如果原对象是响应式的就会触发依赖收集
  }
  set(newValue) {
    this.target[this.key] = newValue; //如果元对象是响应式的就会触发更新
  }
}
