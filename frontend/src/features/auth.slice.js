import { createSlice } from "@reduxjs/toolkit";

const initialState = {
user : null,
isAuthenticated : false,
loading :false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{

    loginSuccess : (state,action)=>{
        state.user = action.payload;
        state.isAuthenticated = true
    },
    logout:(state,action)=>{
       state.user=null
       state.isAuthenticated=false
    },
    updateUser:(state,action)=>{
       state.user = { ...state.user, ...action.payload }
    },

    },
})

export const {loginSuccess,logout,updateUser}=authSlice.actions
export default authSlice.reducer;