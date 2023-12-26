import { combineReducers } from "@reduxjs/toolkit"
import authReducers from '../slices/authSlice'

//EXPLORE ABOUT THIS
const rootReducer=combineReducers({

    auth:authReducers,
    

})

export default rootReducer