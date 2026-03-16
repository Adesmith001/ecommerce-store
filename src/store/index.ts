import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "@/store/features/app/app-slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
