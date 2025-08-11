import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid"; // uuid 라이브러리 임포트

interface ToastProps {
  msg: string;
  isWarning: boolean | null;
  time: number;
  id: string;
}

interface ModalProps {
  msg: string;
  btnInfo: string[];
  title?: string;
  isOpen: boolean;
}

const initialState: { toastItem: ToastProps[]; modalObj: ModalProps } = {
  toastItem: [],
  modalObj: { btnInfo: [], msg: "", title: "", isOpen: false },
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastProps, "id">>) => {
      const newToast: ToastProps = {
        id: uuidv4(),
        ...action.payload,
      };
      state.toastItem.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      // 제거할 토스트의 ID를 페이로드로 받음
      state.toastItem = state.toastItem.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
