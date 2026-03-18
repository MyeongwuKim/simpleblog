type ToastHandler = (isWarning: boolean, msg: string, time: number) => void;

let toastHandler: ToastHandler | null = null;

export const registerToastHandler = (handler: ToastHandler) => {
  toastHandler = handler;
};

export const unregisterToastHandler = (handler: ToastHandler) => {
  if (toastHandler === handler) {
    toastHandler = null;
  }
};

export const showGlobalToast = (
  isWarning: boolean,
  msg: string,
  time: number
) => {
  if (toastHandler) {
    toastHandler(isWarning, msg, time);
    return;
  }

  console.warn("UIProvider 아직 초기화 안됨");
};
