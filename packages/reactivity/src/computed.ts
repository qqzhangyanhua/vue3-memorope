import { isFunction } from "@vue/shared";
import { effect, track, trigger } from "./effect";
import { TrackOpType } from "./operator";

class ComputedRefImpl {
  public _dirty = true;
  public _value;
  public effect;
  constructor(getter, public setter) {
    this.effect = effect(() => {}, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          trigger(this, TrackOpType.SET, "value", this._value);
        }
      },
    });
  }
  get value() {
    //计算属性也要收集依赖
    if (this._dirty) {
      this._value = this.effect();
      this._dirty = false;
    }
    track(this, TrackOpType.GET, "value");
    return this._value;
  }
  set value(val) {
    this.setter(val);
  }
}
export function computed(getterOptions: any) {
  let getter, setter;
  if (isFunction(getterOptions)) {
    getter = getterOptions;
    setter = () => {
      console.log("Computed setter is not supported.");
    };
  } else {
    getter = getterOptions.get;
    setter = getterOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}
