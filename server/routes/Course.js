const express=require('express');
const router=express.Router();

//get all the controllers
const {
  updateCourseProgress
} = require("../controllers/courseProgress");
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/course")
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// Sections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
  } = require("../controllers/Section")
  
  // Sub-Sections Controllers Import
  const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/subSection")
  
  // Rating Controllers Import
  const {
    createRating,
    getAverageRating,
    getAllRating,
  } = require("../controllers/RatingAndReview");

  const {createCategory,
    showAllCategories,
    
    categoryPageDetails
  }=require('../controllers/Category');


  // Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)


// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
//router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
 router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
 router.post("/addSubSection", auth, isInstructor, createSubSection)
// // Get all Registered Courses
//router.get("/getAllCourses", getAllCourses)
// // Get Details for a Specific Courses
 router.post("/getCourseDetails", getCourseDetails)
// // Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// // Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// // Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// // Delete a Course
router.delete("/deleteCourse", deleteCourse)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)


//ROUTER FOR QUIZ
const {createQuiz,submitQuiz,getQuiz}=require('../controllers/Quiz')
router.post("/createQuiz",createQuiz);
router.post("/submitQuiz",submitQuiz);
router.post("/getQuiz",getQuiz);



module.exports=router;
  