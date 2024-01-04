const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")
const Profile = require('../models/profile');

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses
 
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
//router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
router.get('/getEnrolledCourses',auth,getEnrolledCourses);

module.exports = router