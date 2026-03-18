import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ConfirmModalProps = {
  msg: string;
  btnMsg: string[];
  title?: string;
};

export type WriteModalProps = {
  thumbnail: string | null;
  preview: string | null;
  title: string;
  collection: string | null;
};

export type WriteModalResult = {
  thumbnail: string | null;
  collection: string | null;
};

export type ModalDefinitionMap = {
  WRITE: {
    props: WriteModalProps;
    result: WriteModalResult | 0;
  };
  CONFIRM: {
    props: ConfirmModalProps;
    result: 0 | 1;
  };
};

export type ModalType = keyof ModalDefinitionMap;

export type ModalPropsMap = {
  [K in ModalType]: ModalDefinitionMap[K]["props"];
};

export type ModalResultMap = {
  [K in ModalType]: ModalDefinitionMap[K]["result"];
};

type ModalItemByType<T extends ModalType> = {
  id: string;
  type: T;
  props: ModalPropsMap[T];
};

export type ModalItem<T extends ModalType = ModalType> = T extends ModalType
  ? ModalItemByType<T>
  : never;

export interface ModalState {
  modalItem: ModalItem[];
}

const initialState: ModalState = {
  modalItem: [],
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    addModal: (state, action: PayloadAction<ModalItem>) => {
      const newModal: ModalItem = {
        ...action.payload,
      };
      state.modalItem.push(newModal);
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modalItem = state.modalItem.filter(
        (modal) => modal.id !== action.payload
      );
    },
    clearModals: (state) => {
      state.modalItem = [];
    },
  },
});

export const { addModal, removeModal, clearModals } = modalSlice.actions;
export default modalSlice.reducer;
