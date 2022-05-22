export const nodeOps = {
  // b不同的平台创建的方法不同
  createElement: (target) => document.createElement(target), //添加
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    } //删除
  },
  insert: (child, parent, anchor = null) => {
    //插入
    parent.insertBefore(child, anchor);
  },
  querySelector: (selector) => document.querySelector(selector), //查询
  setText: (node, text) => {
    node.textContent = text; //设置文本
  },
  createText: (text) => document.createTextNode(text), //创建文本
  setElementText: (el, text) => {
    el.textContent = text;
  },
  nextSibling: (el) => el.nextSibling,
};
