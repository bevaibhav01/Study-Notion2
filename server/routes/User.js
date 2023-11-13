const express=require('express');
const router=express.Router();


//getting all controllers from auth

const {sendOTP,signUp,login,changePassword}=require('../controllers/Auth');
const {auth,isStudent,isInstructor,isAdmin}=require('../middlewares/auth');

//AUNTHENTICATION ROUTES

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)


module.exports=router;

