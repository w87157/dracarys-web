import { configureStore } from "@reduxjs/toolkit";
import liveReducer from "./live-slice";

// 配置store時直接傳入thunk，無需事先定義Middleware數组
const store = configureStore({
  reducer: {
    liveReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {live: LiveState}
export type AppDispatch = typeof store.dispatch;

export default store;
