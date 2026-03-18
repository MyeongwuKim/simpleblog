"use client";

import { useEffect } from "react";
import {
  registerToastHandler,
  unregisterToastHandler,
} from "@/app/lib/toastManager";

export default function useGlobalToastBridge(
  handler: (isWarning: boolean, msg: string, time: number) => void
) {
  useEffect(() => {
    registerToastHandler(handler);

    return () => {
      unregisterToastHandler(handler);
    };
  }, [handler]);
}
