import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../../features/ui/UiSlice';
import uiAuthslice from './slices/authSlices'
import chatReducer from './slices/chatSlice'
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    protectRoutes: uiAuthslice,
    contact:chatReducer
  },
});

// TypeScript definitions - DO NOT SKIP
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;