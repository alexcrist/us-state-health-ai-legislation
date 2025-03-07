import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "main",
    initialState: {
        isMapInitialized: false,
        focusedState: null,
    },
    reducers: {
        setIsMapInitialized: (state, action) => {
            state.isMapInitialized = action.payload;
        },
        setFocusedState: (state, action) => {
            state.focusedState = action.payload;
        },
    },
});

export default mainSlice;
