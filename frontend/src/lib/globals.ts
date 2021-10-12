import { getCurrentInstance } from "vue";

interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum?: any;
}

export const _window: IWindow = window;

// eslint-disable @typescript-eslint/no-non-null-assertion
export const vm = () => {
  const instance = getCurrentInstance();
  console.log(instance);
};
