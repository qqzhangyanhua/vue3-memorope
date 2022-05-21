// 给元素缓存一个绑定事件列表
// 如果缓存中没有缓存过并且value有值就需要绑定
// 以前绑定过需要删除的
export const patchEvent = (el, key, value) => {
  const invokers = el._evi || (el._evi = {});
  const existing = invokers[key];
  if (value && existing) {
    // 如果存在并且
    existing.value = value;
  } else {
    const eventKey = key.slice(2).toLowerCase();
    if (value) {
      // 绑定事件,以前没有绑定
      let invoker = (invokers[key] = createEventInvoker(value));
      el.addEventListener(eventKey, invoker);
    } else {
      // 以前绑了，但是没有value
      el.removeEventListener(eventKey, existing);
      invokers[key] = undefined; //清空
    }
  }
};

function createEventInvoker(value): any {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = value; //为了随时更改value属性
  return invoker;
}
// 绑定事件
