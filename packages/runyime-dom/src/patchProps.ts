import { patchAttr } from "./modules/attr";
import { patchStyle } from "./modules/style";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/event";
export const patchProps = (el, key, preValue, nextValue) => {
  switch (key) {
    case "class":
      patchClass(el, nextValue);
      break;
    case "style":
      patchStyle(el, preValue, nextValue);
      break;
    default:
      if (/^on[^a-z]/.test(key)) {
        //   事件
        patchEvent(el, key, nextValue); //事件，事件名，事件处理函数
      } else {
        //   如果不是事件！！
        patchAttr(el, key, nextValue);
      }
      break;
  }
};
