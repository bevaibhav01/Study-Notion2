import { combineReducers } from "@reduxjs/toolkit"
import authReducers from '../slices/authSlice'
import profileReducer from "../slices/profileSlice"
import cartReducer from '../slices/cartSlice'
import courseReducer from '../slices/courseSlice'


//EXPLORE ABOUT THIS
const rootReducer=combineReducers({

    auth: authReducers,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    // viewCourse:viewCourseReducer,
    

})

export default rootReducer