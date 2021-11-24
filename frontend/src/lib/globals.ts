import { getCurrentInstance } from "vue-demi";
import type { ComponentInternalInstance } from "vue-demi";

interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum?: any;
}

export const _window: IWindow = window;

export const vm = (): ComponentInternalInstance["proxy"] | undefined => {
  const instance = getCurrentInstance();
  if (instance) return instance.root.proxy;
};
