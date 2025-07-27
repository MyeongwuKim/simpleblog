"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import changeViewSlice from "../reducer/changeView";

const rootReducer = combineReducers({
  changeView: changeViewSlice,
  // 여기에 다른 슬라이스들을 추가하세요.
});

export default rootReducer;

export const store = configureStore({
  reducer: rootReducer,
  // Redux DevTools를 개발 환경에서만 활성화합니다.
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
