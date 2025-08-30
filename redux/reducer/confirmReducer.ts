import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConfrimItemType = {
  id: string;
  props: { msg: string; btnMsg: string[]; title?: string };
};

const initialState: { confirmItem: ConfrimItemType[] } = {
  confirmItem: [],
};

export const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    addConfirm: (state, action: PayloadAction<ConfrimItemType>) => {
      const newModal: ConfrimItemType = {
        ...action.payload,
      };
      state.confirmItem.push(newModal);
    },
    removeConfirm: (state, action: PayloadAction<string>) => {
      state.confirmItem = state.confirmItem.filter(
        (modal) => modal.id !== action.payload
      );
    },
  },
});

export const { addConfirm, removeConfirm } = confirmSlice.actions;
export default confirmSlice.reducer;
