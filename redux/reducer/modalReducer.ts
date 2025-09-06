import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

export type ModalType = "WRITE" | "CONFIRM";

export type ModalPropsMap = {
  WRITE: { thumbnail: string | null; preview: string | null; title: string };
  CONFIRM: { msg: string; btnMsg: string[]; title?: string };
};

type ModalItem<T extends ModalType = ModalType> = {
  id: string;
  type: T;
  props: ModalPropsMap[T];
};

const initialState: { modalItem: ModalItem[] } = {
  modalItem: [],
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    addModal: (state, action: PayloadAction<ModalItem>) => {
      const newToast: ModalItem = {
        ...action.payload,
      };
      state.modalItem.push(newToast);
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modalItem = state.modalItem.filter(
        (modal) => modal.id !== action.payload
      );
    },
  },
});

export const { addModal, removeModal } = modalSlice.actions;
export default modalSlice.reducer;
