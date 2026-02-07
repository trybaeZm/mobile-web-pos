// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./features/userDetailsSlice";

export const store = configureStore({
    reducer: {
        userDetails: userDetailsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
