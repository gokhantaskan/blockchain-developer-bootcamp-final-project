interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum?: any;
}

export const _window: IWindow = window;
