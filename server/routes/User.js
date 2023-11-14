const express=require('express');
const router=express.Router();


//getting all controllers from auth

const {sendOTP,signUp,login,changePassword}=require('../controllers/Auth');
const {auth,isStudent,isInstructor,isAdmin}=require('../middlewares/auth');

const {
    resetPasswordToken,
    resetPassword,
  } = require("../controllers/ResetPassword")
  

//AUNTHENTICATION ROUTES

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


module.exports=router;

