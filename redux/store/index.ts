"use client";
import { configureStore, combineReducers, Action, ThunkAction } from "@reduxjs/toolkit";
import { toastSlice } from "../reducer/toastReducer";
import { counterSlice } from "../reducer/counterSlice";
import { createWrapper } from "next-redux-wrapper";

export const store = () =>
  configureStore({
    reducer: {
      toastReducer: toastSlice.reducer,
    },
    // Redux DevTools를 개발 환경에서만 활성화합니다.
    devTools: true,
  });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(store);