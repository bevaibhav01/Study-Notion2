import { createSlice } from "@reduxjs/toolkit"

const intitalState={
    token: localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,


}

const authSlice=createSlice({
    name:"auth",
    initialState:intitalState,
    reducers:{
        setToken(state,value){
            state.token=value.payload
        },
    },
})

export const {setToken}= authSlice.actions;


export default authSlice.reducer;