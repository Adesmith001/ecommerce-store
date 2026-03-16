import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "@/store/features/app/app-slice";
import { catalogDiscoveryReducer } from "@/store/features/catalog/catalog-discovery-slice";
import { catalogApi } from "@/store/services/catalog-api";

export const store = configureStore({
  reducer: {
    app: appReducer,
    catalogDiscovery: catalogDiscoveryReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
