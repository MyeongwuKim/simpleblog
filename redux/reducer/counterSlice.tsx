// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. 상태(State)의 타입 정의
interface CounterState {
  value: number;
}

// 2. 초기 상태 정의
const initialState: CounterState = {
  value: 0,
};

// 3. Slice 생성
export const counterSlice = createSlice({
  name: 'counter', // Slice의 이름
  initialState,   // 초기 상태
  reducers: {
    // 4. Reducer와 Action 정의 (PayloadAction을 사용하여 액션 페이로드 타입 정의)
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// 5. Action Creator 내보내기
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 6. Reducer 내보내기
export default counterSlice.reducer;