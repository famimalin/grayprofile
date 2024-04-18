/*=====================================
    app 的 redux

    Author: Gray
    CreateTime: 2024 / 04 / 05
=====================================*/
import { createSlice } from "@reduxjs/toolkit";

/*--------------------------
    store initial state
--------------------------*/
interface AppState {
    imageModal: {
        isOpen: boolean;
        imageUrl: string;
    };
}

const initialState = {
    imageModal: {
        isOpen: false,
    },
} as AppState;

const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        openImageModal: (
            state,
            actions: {
                payload: {
                    imageUrl: string;
                };
            }
        ) => {
            const { payload } = actions;
            state.imageModal.isOpen = true;
            state.imageModal.imageUrl = payload.imageUrl;
        },
        closeImageModal: (state, actions) => {
            state.imageModal.isOpen = false;
            state.imageModal.imageUrl = "";
        },
    },
    extraReducers: (builder) => {},
});

/*--------------------------
    Exprot
--------------------------*/
const AppReducer = appSlice.reducer;
const AppActions = appSlice.actions;

export default AppReducer;
export { AppActions };
