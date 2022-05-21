import { hasOwnProperty } from "@vue/shared";

export const publicInstanceHandler = {
  get({ _: instance }, key: string) {
    const { setupState, data, props, ctx, setupContext } = instance;
    if (key[0] === "$") {
      return;
    }
    if (hasOwnProperty(setupState, key)) {
      return setupState[key];
    } else if (hasOwnProperty(data, key)) {
      return data[key];
    } else if (hasOwnProperty(props, key)) {
      return props[key];
    } else {
      return undefined;
    }
  },
  set({ _: instance }, key, value) {
    const { setupState, data, props, ctx, setupContext } = instance;
    if (hasOwnProperty(setupState, key)) {
      return setupState[key];
    } else if (hasOwnProperty(data, key)) {
      return data[key];
    } else if (hasOwnProperty(props, key)) {
      return props[key];
    }
    return true;
  },
};
