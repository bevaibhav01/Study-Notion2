const {instance}=require('../config/razorpay');

const Course=require('../models/Course');

const User=require('../models/User');

const mailSender=require('../utils/mailSender');
const mongoose = require("mongoose")

const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollmentEmail');

const crypto = require("crypto")


const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  console.log("back1")
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
       const uid = new mongoose.Types.ObjectId(userId)
       console.log("user",userId)
       console.log("uid1",uid)
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }
      console.log("uid2",uid)

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}

//capture the payment and initiate the razorpay order

// exports.capturePayment=async (req,res)=>{
//     try{

//         //get course id and usrer id
//         const {courseId}=req.body
//         const userId=req.user.id;
//         //validation 
//         if(!userId||!courseId){
//             return res.status(200).json({
//                 success:false,
//                 message:'details missing'
//             })
//         }
//         //valid course

//         const courseDetails=await Course.findById(courseId);
//         if(!courseDetails){
//             return res.status(200).json({
//                 success:false,
//                 message:'not a valid course'
//             }) 
//         }

//         //valid user

//         const userDetails=await User.findById(userId);
//         if(!userDetails){
//             return res.status(200).json({
//                 success:false,
//                 message:'not a valid user'
//             })  
//         }
//         //already buyed course or not
//         const uid=new mongoose.Types.ObjectId(userId);
        
//         if(Course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:'Already enrolled'
//             })  
//         }

//         //create order
//         const amount=Course.price;
//         const currency="INR";

//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId:courseId,
//                 userId:userId,
//             }


//         }
//         try{

//             //initiate the payment
//             const paymentResponse=await instance.orders.create(options);
//             console.log(paymentResponse);
            

//         }catch(error){
//             return res.status(200).json({
//                 success:false,
//                 message:'could not initiate payment'
//             })  
//         }

//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:courseDetails.courseName,
//             courseDescription:courseDetails.courseDescription,
//             orderId:paymentResponse.id,
//             amount:paymentResponse.amount,
//         })

//     }catch(error){
//         return res.status(200).json({
//             success:false,
//             message:'payment went wrong'
//         })  
//     }
// }


// //verify signature

// exports.verifySignature=async (req,res)=>{
//     const webHookSecret='12345678';
//     const signature=req.headers["x-razorpay-signature"];

//     const shasum=crypto.createHmac("sha256",webHookSecret)
     
//     shasum.update(JSON.stringify(req.body));

//     const digest=shasum.digest('hex');
//     if(signature===digest){
//         //payment authorized
//         console.log("Payment authorized");

//         const {courseId,userId}=req.body.payload.payment.entity.notes;

//         try{
//             //fulfil action

//             //find the course and enroll the 
//             const enrolledCourse=await Course.findByIdAndUpdate({_id:courseI},{$push:{studentsEnrolled:userId}},{new:true},);
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     sucess:false,
//                     message:"Course not exits"
//                 })
//             }

//             //find user and add course

//             const userEnrolled=await User.findByIdAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true});

//             //mail send of confirmation

//             const emailResponse=await mailSender(
//                 userEnrolled.email,
//                 "Congratulations from codehelp",
//                 "Congratulations , you onboard on the course",
//             );

//             return res.status(200).json({
//                 success:true,
//                 message:error.message
//             })


//         }catch(error){
//             return res.status(400).json({
//                 sucess:false,
//                 message:"Something went wrong"
//             })
//         }

//     }


// }