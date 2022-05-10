export const isObject = (value) => typeof value === "object" && value !== null;
export const extend = Object.assign;
export const isArray = Array.isArray;
export const isFunction = (value) => typeof value === "function";
export const isNumber = (value) => typeof value === "number";
export const isBoolean = (value) => typeof value === "boolean";
export const isString = (value) => typeof value === "string";
export const isIntegerKey = (value) => parseInt(value) + "" === value;
export const hasOwnProperty = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);
export const hasChanges = (oldValue, newValue) => oldValue !== newValue;
