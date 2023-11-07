const {instance}=require('../config/razorpay');

const Course=require('../models/Course');

const User=require('../models/User');

const mailSender=require('../utils/mailSender');

const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollmentEmail');

//capture the payment and initiate the razorpay order

exports.capturePayment=async (req,res)=>{
    try{

        //get course id and usrer id
        const {courseId}=req.body
        const userId=req.user.id;
        //validation 
        if(!userId||!courseId){
            return res.status(200).json({
                success:false,
                message:'details missing'
            })
        }
        //valid course

        const courseDetails=await Course.findById(courseId);
        if(!courseDetails){
            return res.status(200).json({
                success:false,
                message:'not a valid course'
            }) 
        }

        //valid user

        const userDetails=await User.findById(userId);
        if(!userDetails){
            return res.status(200).json({
                success:false,
                message:'not a valid user'
            })  
        }
        //already buyed course or not
        const uid=new mongoose.Types.ObjectId(userId);
        
        if(Course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'Already enrolled'
            })  
        }

        //create order
        const amount=Course.price;
        const currency="INR";

        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:courseId,
                userId:userId,
            }


        }
        try{

            //initiate the payment
            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);
            

        }catch(error){
            return res.status(200).json({
                success:false,
                message:'could not initiate payment'
            })  
        }

        //return response
        return res.status(200).json({
            success:true,
            courseName:courseDetails.courseName,
            courseDescription:courseDetails.courseDescription,
            orderId:paymentResponse.id,
            amount:paymentResponse.amount,
        })

    }catch(error){
        return res.status(200).json({
            success:false,
            message:'payment went wrong'
        })  
    }
}


//verify signature