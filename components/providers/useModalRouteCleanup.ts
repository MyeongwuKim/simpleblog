"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { clearModals } from "@/redux/reducer/modalReducer";
import { modalManager } from "@/app/lib/modalManager";

export default function useModalRouteCleanup() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevRouteRef = useRef<string>("");
  const dispatch = useAppDispatch();
  const modalItems = useAppSelector((state) => state.modalReducer.modalItem);

  useEffect(() => {
    const currentRoute = `${pathname}?${searchParams.toString()}`;

    if (prevRouteRef.current && prevRouteRef.current !== currentRoute) {
      modalManager.cleanupMany(
        modalItems.map((modal) => modal.id),
        0
      );
      dispatch(clearModals());
    }

    prevRouteRef.current = currentRoute;
  }, [dispatch, modalItems, pathname, searchParams]);
}
