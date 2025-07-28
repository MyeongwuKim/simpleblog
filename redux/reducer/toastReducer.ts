import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리 임포트

interface ToastProps {
  msg: string;
  isWarning: boolean | null;
  time: number;
  id:string;
}



const initialState:{toastItem:ToastProps[]} = {
  toastItem:[]
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    add: (state, action: PayloadAction< Omit<ToastProps,"id"> >) => {
      const newToast: ToastProps = {
        id: uuidv4(), 
        ...action.payload,
      };
      state.toastItem.push(newToast);
    },
     remove: (state, action: PayloadAction<string>) => { // 제거할 토스트의 ID를 페이로드로 받음
      state.toastItem = state.toastItem.filter(toast => toast.id !== action.payload);
    },
  },
});

export const { add,remove } = toastSlice.actions;
export default toastSlice.reducer;
