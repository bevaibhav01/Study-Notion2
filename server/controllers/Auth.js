
const User=require('../models/User');
const OTP=require("../models/OTP");
const otpGenrator=require('otp-generator')
const Profile=require('../models/profile');
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')
const mailSender=require('../utils/mailSender')
require('dotenv').config();
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
//REVIEW THE CODE AGAIN 

//send OTP
exports.sendOTP=async (req,res)=>{
   try{
    // used in case of sign up
   //fetch request from user body
   const {email}=req.body;

   //check if user exist
   const checkUserPresent=await User.findOne({email});

   //if exist return fail because user already exist

   if(checkUserPresent){
    return res.status(401).json({
        success:false,
        message:"USER ALREADY EXIST"
    })

   }
   
   //genrating otp using otp-genrator
   let otp=otpGenrator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false,
   });

   console.log(otp,'genrated otp');

   //checking if otp exits in db
   let otpExist=await OTP.findOne({otp:otp});
   //find until unique one 
   while(otpExist){
    otp=otpGenrator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
       });

       otpExist=await OTP.findOne({otp:otp}); 

   }

   const otpPayload={email,otp};
   
   //creating entry at db
   const otpBody=await OTP.create(otpPayload);
   console.log(otpBody,'otpbody');

   //return response
   res.status(200).json({
    success:true,
    message:'OTP sent successfully',
    otp

   })



}
catch(error){
    console.log(error,"error during otp genration");
    return res.status(500).json({
        sucess:false,
        message:error.message,
    })

}

   


}


//SIGNUP
exports.signUp=async (req,res)=>{
    try{

    //data fetch from req body
    const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;

    //validate info
    if(!firstName||!lastName||!email||!password||!confirmPassword||!otp){
        return res.status(403).json({
            success:false,
            message:"All field are required"
        })
    }

    //match both password
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm password does not match"
        })

    }

    //check user exits 
    const userExist=await User.findOne({email});

    if(userExist){
        return res.status(400).json({
            success:false,
            message:"User Already Exist"
        })

    }

    //find most recent otp for user
    const recentOtp=await  OTP.find({email}).sort({createdAt:-1});
    console.log(recentOtp,'recent otp');

    //validate otp
    if(recentOtp.length===0){
        return res.status(400).json({
            success:false,
            message:"OTP Not found"
        })

    }else if(otp!==recentOtp[0].otp){
        console.log(otp)
        console.log(recentOtp)
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        })
    } 


    //hash password
    const hashedPassword=await bcrypt.hash(password,10);

    //create db entry
    const profileDetails=await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null});
    const user=await User.create({firstName,lastName,email,contactNumber,password:hashedPassword,accountType,additionalDetails:profileDetails._id,
    image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    //send res
    return res.status(200).json({
        sucess:true,
        message:"User Registered",
        user,
    })
    }catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"user cannot register",
    })

}


}

//login
exports.login=async (req,res)=>{
    try{
        //get data
    const {email,password}=req.body;

       //validate data
       if(!email||!password){
        return res.status(403).json({
            success:false,
            message:"All fields required"
        })
       }
       //user exist
       const user=await User.findOne({email});
       if(!user){
        return res.status(401).json({
            success:false,
            message:"USER NOT REGISTERED"
        })

       }
       //password match

       if(await bcrypt.compare(password,user.password)){
        const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        })

        user.token=token;
        user.password=undefined;

        //cookie send
        const options={
            expires:new Date(Date.now()+3*24*60*100),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:'Logged in successfully'
        })
       }else{
        return res.status(401).json({
            success:false,
            message:"password did not match"
        })
       }
       //genrate jwt token
       //create cookie send response

    }catch(error){

        return res.status(500).json({
            success:false,
            message:"error while login"
        })
       

    }
     

}

//change password
exports.changePassword=async (req,res)=>{
    try{
    //get data
   // const {email,oldPass}=req.body;

   //getting user DATA
    const userDetails=User.findOne(req.user.id);

    const {oldPass,newPass}=req.body;

    
    //comparing old pass with passoword in db for validation
    //comparing old password
    const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )

      if(!isPasswordMatch){
        return res.status(401).json({
            success:false,
            message:"Passoword did not match"
        })
      }
   
    //update passoword
    const encryptedPassword=await bcrypt.hash(newPass,10);
    const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
    

    
    //send mail-password change
    try{
        const emailResponse=await mailSender(
           updatedUserDetails.email,"PASSWORD CHANGED SUCCESFULLY",
           passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )

    }catch(error){
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }
    //return response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })

}catch(error){
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
}


}