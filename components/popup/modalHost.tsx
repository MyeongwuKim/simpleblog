"use client";

import { AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { removeModal } from "@/redux/reducer/modalReducer";
import { modalManager } from "@/app/lib/modalManager";
import { renderModal } from "./modalRegistry";

export default function ModalHost() {
  const dispatch = useAppDispatch();
  const modalItems = useAppSelector((state) => state.modalReducer.modalItem);

  return (
    <AnimatePresence>
      {modalItems.map((modal) => (
        <div key={modal.id}>
          {renderModal(modal, (result) => {
            dispatch(removeModal(modal.id));
            modalManager.resolve(modal.id, result);
          })}
        </div>
      ))}
    </AnimatePresence>
  );
}
