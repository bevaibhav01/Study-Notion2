const Course=require('../models/Course');
const Tag=require('../models/Tag');
const User=require('../models/User');
const uploadImageCloudinary=require('../utils/imageUploader')

 //create course

 exports.createCourse=async (req,res)=>{
    try{
   //fetch data 
   const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;

   //get thumbnail
   const thumbnail=req.files.thumbaiImages;

   //validation
   if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag||!thumbnail){
    return res.status(400).json({
        success:false,
        message:'All files required',
    })
   }

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
   const tagDetails=await Tag.findById(tag);
   if(!tagDetails){
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
    tag:tag,
    thumbnail:thumbnailImage.secure_url,

   });
   
    //user instructor update add user list

    await User.findByIdAndUpdate({
        _id:instructorDetails._id
    },{$push :{
        courses:newCourse._id
    }},{new:true});

    //update the tag schema
    //todo

    //return response
    return res.status(200).json({
        success:true,
        message:"Course created",
        data:newCourse,
    });

}catch(error){
    return res.status(500).json({
        success:false,
        message:'Somethings went wrong ',
       });
}



 }

 //get all course

 exports.showAllCourses=async (req,res)=>{
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
        const courseDetails=await Course.find({_id:courseId}).populate(
            {
                path:"instructor",populate:{
                    path:"additionalDetails",
                },
            }
        ).populate('category').populate("ratingsAndreviews").populate({
            path:"coursecontent",populat:{
                path:'subSection',
            },
        }).exec();

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
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })

    }
 }