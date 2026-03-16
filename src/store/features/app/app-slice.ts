import { createSlice } from "@reduxjs/toolkit";

type AppState = {
  adminSidebarOpen: boolean;
};

const initialState: AppState = {
  adminSidebarOpen: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleAdminSidebar: (state) => {
      state.adminSidebarOpen = !state.adminSidebarOpen;
    },
  },
});

export const { toggleAdminSidebar } = appSlice.actions;
export const appReducer = appSlice.reducer;
