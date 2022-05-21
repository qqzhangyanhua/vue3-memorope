export const patchStyle = (el, preValue, nextValue) => {
  const style = el.style;
  if (nextValue === null) {
    el.removeAttribute("style");
  } else {
    // 新的里面有没有
    if (preValue) {
      for (let key in preValue) {
        if (nextValue[key] === null) {
          // 老的有，新的没有 需要删除
          style[key] = "";
        }
      }
    }
    for (let key in nextValue) {
      style[key] = nextValue[key];
    }
  }
};
