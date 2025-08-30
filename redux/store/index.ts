"use client";
import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { toastSlice } from "../reducer/toastReducer";
import { confirmSlice } from "../reducer/confirmReducer";

export const store = () =>
  configureStore({
    reducer: {
      toastReducer: toastSlice.reducer,
      confirmReducer: confirmSlice.reducer,
    },
    // Redux DevTools를 개발 환경에서만 활성화합니다.
    devTools: true,
  });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(store);
