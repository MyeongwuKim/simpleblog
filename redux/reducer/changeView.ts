import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type stateType = {
  value: boolean;
};

const initialState: stateType = {
  value: false,
};

export const changeView = createSlice({
  name: "ViewState",
  initialState,
  reducers: {
    ProfileSettingForm: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { ProfileSettingForm } = changeView.actions;

export default changeView.reducer;
