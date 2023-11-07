const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema=new mongoose.Schema({
   email:{
    type:String,
    reqired:true,

   },
   otp:{
    type:String,
    reqired:true,
   },
   createdAt:{
    type:String,
    default:Date.now(),
    expires:5*60,
    

   }

});

//function to send email of otp
async function sendVerificationEmail(email,otp){
   try{
      const mailResponse=await mailSender(email,"Verifaction Mail from Study Notion",otp);
      console.log("Email sent succesfully",mailResponse);

   }catch(error){
      console.log(error+'error occured while sending mail');
      throw error
   }
}

//pre hook middleware
otpSchema.pre("save",async function(next){
   await sendVerificationEmail(this.email,this.otp);
   next();
})


module.exports=mongoose.model("OTP",otpSchema);