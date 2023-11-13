const RatingAndReviews=require('../models/RatingAndReviews')

const Course=require('../models/Course');
const { default: mongoose } = require('mongoose');

//create rating

exports.createRating=async (req,res)=>{
    try{

        //get user id
        const userId=req.user.id;
        //get course id
        const {rating,review,CourseId}=req.body;
        //check if enrolled
        const courseDetails=await Course.findOne({
            _id:CourseId,studentsEnrolled:{$elemMatch:{$eq:userId},}
        });

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Buy course first",
            })
        }
        //check already written reviews
        const alreadyReviewed=await RatingAndReviews.findOne({
            user:userId,course:CourseId
        });

        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Already reviwed"
            })
        }
        //create rating 

        const ratingReview=await RatingAndReviews.create({
            user:userId,course:CourseId,rating:rating,review:review,
        });

        //update course adding rating

        const updateCourse= await Course.findByIdAndUpdate({_id:CourseId},
            {$push:{ratingAndReview:ratingReview._id}},
            {new:true})
            

        //return response

        return res.status(200).json({
            success:true,
            message:"Rating and Review created",
            ratingReview,
            updateCourse,
        })



    }catch(error){

        return res.status(500).json({
            success:false,
            message:"went wrong"
        })

    }
}




//get avg rating 
exports.getAvgRating=async (req,res)=>{
    try{
        //get course id
        const {courseId}=req.body;
        //calculate avg rating 
        const result=await RatingAndReviews.aggregate([
            {
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
            }
        },{
            $group:{
                _id:null,
                averageRating:{$avg:'$rating'},
            }
        }
        ]);

        //return res
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }else{
            return res.status(200).json({
                success:true,
                message:"No rating till now 0 rating",
                averageRating:0,
            })

        }



    }catch(error){

    }
}




//get all ratings

exports.getAllRatings=async (req,res)=>{
    try{

       // const {courseId}=req.body;

       //get all reviews

       const allreviews = await RatingAndReviews
       .find({})
       .sort({ rating: 'desc' })
       .populate({
         path: 'user',
         select: 'firstName lastName email image'
       })
       .populate({
         path: 'course',
         select: 'courseName'
       }).exec();

       return res.status(200).json({
        success:true,
        message:"All reviews fetch",
        data:allreviews,
       })
     


    }catch(error){
        console.error(error); // Log the error for debugging
    return res.status(500).json({
    success: false,
    error: 'Internal server error'
  });

    }
}