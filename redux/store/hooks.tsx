import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppState, AppDispatch } from ".";

// useAppDispatch: Redux에 액션을 보내는(상태 변경 요청하는) 커스텀 훅
// useAppSelector: Redux store의 상태 값을 읽어오는(구독하는) 커스텀 훅,AppState를 통한 타입지정
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
