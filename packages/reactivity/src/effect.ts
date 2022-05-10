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
