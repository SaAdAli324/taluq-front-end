import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { contactInfoInterface } from "../../../types/type";


interface ContactState {
    contactInfo: contactInfoInterface | null;
    loading: boolean;
}

const initialState: ContactState = {
    contactInfo: null,
    loading: false
};

const chatSlice = createSlice({
    name: "contactInfo",
    initialState,
    reducers: {
        
        setContact: (state, action: PayloadAction<contactInfoInterface | null>) => {
            state.loading = false;
    
            state.contactInfo = action.payload || null; 
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
  
});

export const { setContact, setLoading } = chatSlice.actions;
export default chatSlice.reducer;