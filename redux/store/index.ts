"use client";
import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
import { popupSlice } from "../reducer/popupReducer";
import { createWrapper } from "next-redux-wrapper";

export const store = () =>
  configureStore({
    reducer: {
      popupReducer: popupSlice.reducer,
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
