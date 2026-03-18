"use client";

import ModalHost from "../popup/modalHost";
import ToastHost from "../popup/toastHost";
import useModalRouteCleanup from "./useModalRouteCleanup";

export function PopupContainer() {
  useModalRouteCleanup();

  return (
    <>
      <ModalHost />
      <ToastHost />
    </>
  );
}
