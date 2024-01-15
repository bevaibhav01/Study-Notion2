const Course=require('../models/Course');
const Category=require('../models/Category');
const User=require('../models/User');
const {uploadImageCloudinary }=require('../utils/imageUploader')
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

 //create course

 exports.createCourse=async (req,res)=>{
    try{
   //fetch data 
   const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body;
   let status;
   //get thumbnail
   //const thumbnail=req.files.thumbnailImages;
   const thumbnail = req.files.thumbnailImage
  // const thumbnail=req.body.thumbnailImage;
   console.log(courseName,courseDescription,whatYouWillLearn,price,category,thumbnail);

   //validation
   if(!courseName||!courseDescription||!whatYouWillLearn||!price||!category||!thumbnail){
    return res.status(400).json({
        success:false,
        message:'All files required',
    })
   }

   //if (!status || status === undefined) {
    status = "Draft"
  //}

   //check for instructor
   const userId=req.user.id;
   const instructorDetails=await User.findById(userId);
   console.log("Instructor log",instructorDetails);

   if(!instructorDetails){
    return res.status(404).json({
        success:false,
        message:'User not found',
    })
   }
//verify user.id and instructior id is same
   //tag validation
   const categoryDetails=await Category.findById(category);
   if(!categoryDetails){
           return res.status(404).json({
            success:false,
            message:'Tag Details not found',
           });
         
   }

   //upload image to cloudinary
   const thumbnailImage=await uploadImageCloudinary(thumbnail,process.env.FOLDER_NAME);

   //CREATE ENTRY NOR NEW COURSE
   const newCourse=await Course.create({
    courseName,
    courseDescription,
    instructor:instructorDetails._id,
    whatYouWillLearn:whatYouWillLearn,
    price,
    Category:category,
    thumbnail:thumbnailImage.secure_url,
    status:status,

   });
   
    //user instructor update add user list

    await User.findByIdAndUpdate({
        _id:instructorDetails._id
    },{$push :{
        courses:newCourse._id
    }},{new:true});


    //update in category 
    const categoryDetails2 = await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )

    //update the tag schema
    //todo

    //return response
    return res.status(200).json({
        success:true,
        message:"Course created",
        data:newCourse,
    });

}catch(error){
    console.log(error)
    return res.status(500).json({
        
        success:false,
        message:'Somethings went wrong ',
       });
}



 }

 //get all course

 exports.getAllCourses=async (req,res)=>{
    try{
        const allCourses=await Course.find({},{courseName:true,courseDescription:true,thumbnail:true,
        instructor:true,ratingAndReview:true,studentsEnrolled:true}).populate('instructor').exec();
        return res.status(200).json({
            success:true,
            message:"All courses fetched",
            data:allCourses,
        });


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Somethings went wrong ',
           });
    }
 }

 //get course details

 exports.getCourseDetails=async (req,res)=>{
    try{
        //get id
        const {courseId}=req.body;

        //find course details
        const courseDetails = await Course.findOne({
            _id: courseId,
          })
            .populate({
              path: "instructor",
              populate: {
                path: "additionalDetails",
              },
            })
            .populate("Category")
            .populate("ratingAndReview")
            .populate({
              path: "courseContent",
              populate: {
                path: "subSection",
               
              },
            })
            .exec()
        //console.log(courseDetails.courseCone);
           

        //POPULATE RATIN AND REVIEW LATER

        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Course not exists"
            })
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Data fetched",
            courseDetails,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })

    }
 }

 // Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("Category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("Category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}