import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isChatOpen: false, // Default: show contacts on mobile
  },
  reducers: {
    openChat: (state) => {
      state.isChatOpen = true;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
    },
  },
});

export const { openChat, closeChat } = uiSlice.actions;
export default uiSlice.reducer;