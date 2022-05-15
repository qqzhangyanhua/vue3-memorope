import { isArray, isIntegerKey } from "@vue/shared";
import { TrackOpType } from "./operator";
// effect的所有属性都会收集effect
// 当属性发生变化就会触发更新呢
export function effect(fn, options: any = {}) {
  const effect = createEffect(fn, options);
  if (!options.lazy) {
    effect(); //响应式默认执行一遍
  }
  return effect;
}
let uid = 0;
let activeEffect;
const effectStack = [];
function createEffect(fn: any, options: {}) {
  const effect = function reactiveEffect() {
    console.log("creating effect=====");
    if (!effectStack.includes(effect)) {
      //防止递归死循环
      try {
        activeEffect = effect;
        effectStack.push(effect);
        return fn(); //函数执行会走get
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };

  effect.id = uid++; //制作一个唯一表示
  effect._isEffect = true; //用于表示这个响应式
  effect.raw = fn; //保留函数
  effect.options = options; //保存用户的属性
  return effect;
}
const targetMap = new WeakMap();
export function track(target: any, type, key: any) {
  if (activeEffect === undefined) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
  console.log("track====", targetMap);
}

export function trigger(target, type, key?, newValue?, oldValue?) {
  //   console.log("trigger====", target, type, key, newValue, oldValue);
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set();
  const add = (effectToAdd) => {
    if (effectToAdd) {
      effectToAdd.forEach((effect) => {
        effects.add(effect);
      });
    }
  };
  // 判断修改是是不是length
  if (key === "length" && isArray(target)) {
    // 如果对应的长度有更新
    depsMap.forEach((dep) => {
      if (key === "length" || key > newValue) {
        add(dep);
      }
    });
  } else {
    //可能是对象
    if (key !== undefined) {
      //这里肯定是新增
      add(depsMap.get(key));
    }
    //   多种场景下数组直接修改length
    switch (type) {
      case TrackOpType.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get("length"));
        }
    }
  }
  effects.forEach((effect: any) => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect);
    } else {
      effect();
    }
  });
}
