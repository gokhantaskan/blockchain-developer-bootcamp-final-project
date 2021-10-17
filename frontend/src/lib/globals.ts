import { getCurrentInstance } from "@vue/composition-api";

interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum?: any;
}

export const _window: IWindow = window;

export const vm = () => {
  // eslint-disable @typescript-eslint/no-non-null-assertion
  const instance = getCurrentInstance()!;
  return instance.root;
};
