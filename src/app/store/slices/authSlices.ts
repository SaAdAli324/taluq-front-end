import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    user:any | null,
    isAuthenticated:Boolean,
    isCheckingAuth:Boolean
}

const initialState : AuthState={

    user:null,
    isAuthenticated:false,
    isCheckingAuth:true
}

const uiAuthSlice = createSlice({
    name: "protectRoutes",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.isCheckingAuth=false
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.isCheckingAuth=false
        },
        setCheckingAuth:(state , action:PayloadAction<Boolean>)=>{
            state.isCheckingAuth=action.payload
        }
    }



})
export const { login, logout , setCheckingAuth } = uiAuthSlice.actions
export default uiAuthSlice.reducer

