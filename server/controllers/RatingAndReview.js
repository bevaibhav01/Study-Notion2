const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");
const {analyzeSentiment}=require('./SentimentAnalyzer');

//createRating
const { exec } = require('child_process');
const natural = require('natural');
const stopword = require('stopword');

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        // const alreadyReviewed = await RatingAndReview.findOne({
        //     user: userId,
        //     course: courseId,
        // });
        // if (alreadyReviewed) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Course is already reviewed by the user',
        //     });
        // }

        let cleanedReview = review.toLowerCase();
        cleanedReview = cleanedReview.replace(/[^\w\s]/g, '');
        cleanedReview = stopword.removeStopwords(cleanedReview.split(' ')).join(' ');

        // Run Python sentiment analysis with VADER
        exec(`python ./scripts/sentiment.py "${cleanedReview}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return res.status(500).json({ success: false, message: 'Sentiment analysis failed' });
            }

            const sentimentResult = JSON.parse(stdout);
            console.log(sentimentResult,"result")
            const sentimentScore = sentimentResult.compound;  // VADER's compound score
            let sentimentCategory = 'neutral';
            if (sentimentScore > 0.05) sentimentCategory = 'positive';
            else if (sentimentScore < -0.05) sentimentCategory = 'negative';

            // Keyword Extraction using TF-IDF
            const TfIdf = natural.TfIdf;
            const tfidf = new TfIdf();
            tfidf.addDocument(cleanedReview);
            const keyPhrases = [];
            tfidf.listTerms(0).forEach(item => {
                if (item.tfidf > 0.1) keyPhrases.push(item.term);
            });

            RatingAndReview.create({
                rating,
                review,
                course: courseId,
                user: userId,
                sentimentScore,
                sentimentCategory,
                keyPhrases,
            })
            .then((ratingReview) => {
                Course.findByIdAndUpdate(
                    { _id: courseId },
                    { $push: { ratingAndReviews: ratingReview._id } },
                    { new: true }
                )
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Rating and Review created Successfully",
                        ratingReview,
                    });
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ success: false, message: error.message });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// exports.createRating = async (req, res) => {
//     try{

//         //get user id
//         const userId = req.user.id;
//         //fetchdata from req body
//         const {rating, review, courseId} = req.body;
//         //check if user is enrolled or not
//         const courseDetails = await Course.findOne(
//                                     {_id:courseId,
//                                     studentsEnrolled: {$elemMatch: {$eq: userId} },
//                                 });

//         if(!courseDetails) {
//             return res.status(404).json({
//                 success:false,
//                 message:'Student is not enrolled in the course',
//             });
//         }
//         //check if user already reviewed the course
//         const alreadyReviewed = await RatingAndReview.findOne({
//                                                 user:userId,
//                                                 course:courseId,
//                                             });
//         if(alreadyReviewed) {
//                     return res.status(403).json({
//                         success:false,
//                         message:'Course is already reviewed by the user',
//                     });
//                 }
//         //create rating and review
//         const ratingReview = await RatingAndReview.create({
//                                         rating, review, 
//                                         course:courseId,
//                                         user:userId,
//                                     });
       
//         //update course with this rating/review
//         const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
//                                     {
//                                         $push: {
//                                             ratingAndReviews: ratingReview._id,
//                                         }
//                                     },
//                                     {new: true});
//         console.log(updatedCourseDetails);
//         //return response
//         return res.status(200).json({
//             success:true,
//             message:"Rating and Review created Successfully",
//             ratingReview,
//         })
//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }

// exports.createRating = async (req, res) => {
//     try {
//         // Get user ID
//         const userId = req.user.id;
        
//         // Fetch data from request body
//         const { rating, review, courseId } = req.body;

//         // Check if user is enrolled in the course
//         const courseDetails = await Course.findOne({
//             _id: courseId,
//             studentsEnrolled: { $elemMatch: { $eq: userId } },
//         });

//         if (!courseDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Student is not enrolled in the course',
//             });
//         }

//         // Check if the user already reviewed the course
//         const alreadyReviewed = await RatingAndReview.findOne({
//             user: userId,
//             course: courseId,
//         });

//         if (alreadyReviewed) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Course is already reviewed by the user',
//             });
//         }

//         // Perform sentiment analysis on the review text
//         const { sentimentScore, sentimentCategory, keyPhrases } = await analyzeSentiment(review);

//         // Create rating and review with sentiment data
//         const ratingReview = await RatingAndReview.create({
//             rating,
//             review,
//             course: courseId,
//             user: userId,
//             sentimentScore,
//             sentimentCategory,
//             keyPhrases
//         });

//         // Update course with the new rating and review
//         const updatedCourseDetails = await Course.findByIdAndUpdate(
//             { _id: courseId },
//             {
//                 $push: {
//                     ratingAndReviews: ratingReview._id,
//                 },
//             },
//             { new: true }
//         );

//         console.log(updatedCourseDetails);

//         // Return response
//         return res.status(200).json({
//             success: true,
//             message: "Rating and Review created successfully with sentiment analysis",
//             ratingReview,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };



//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}

// const RatingAndReview = require('../models/RatingAndReview');  // Assuming the model is named RatingAndReview
// const Course = require('../models/Course');  // Assuming you have a Course model

exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;  // Get course ID from request params

        // Step 1: Fetch the course details to ensure the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Step 2: Fetch the reviews for the specific course, populate necessary fields
        const reviews = await RatingAndReview.find({ course: courseId })
            .populate({
                path: 'user',
                select: 'firstName lastName email image',  // Populate user info (optional)
            })
            .populate({
                path: 'course',
                select: 'courseName',  // Populate course name (optional)
            })
            .exec();

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No reviews found for this course',
            });
        }

        // Step 3: Format and include sentiment data (sentiment score, sentiment category, key phrases)
        const reviewsWithSentiment = reviews.map(review => ({
            user: review.user,  // User info
            review: review.review,  // Review text
            rating: review.rating,  // Rating score
            sentimentScore: review.sentimentScore,  // Sentiment score
            sentimentCategory: review.sentimentCategory,  // Sentiment category (positive, negative, neutral)
            keyPhrases: review.keyPhrases,  // Key phrases from the review
        }));

        // Step 4: Return the reviews along with sentiment data in the response
        return res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully',
            data: reviewsWithSentiment,  // Reviews with sentiment data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
