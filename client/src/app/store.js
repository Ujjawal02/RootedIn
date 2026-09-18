import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../features/api/apiSlice";
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

console.log("STORE MODULE EVALUATED — instance id:", Math.random());
/**enables refetchOnFocus/refetchOnReConnect from earlier */
setupListeners(store.dispatch);
