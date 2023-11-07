const User=require('../models/User')
const mailSender=require('../utils/mailSender');


//resetPasswordToken

exports.resetPasswordToken=async (req,res)=>{
    try{
    //get email from req body
    const email=req.body.email;

    //check user exist
    const user=await User.findOne({email:email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:'User does not exist'
        })
    }

    //genrate token
    const token=crypto.randomUUID();

    //update user by adding token and expiratoion date
    const updatedUser=await User.findOneAndUpdate({email:email},{
        token:token,resetPasswordExpires:5*60*1000
    },{new:true});

    //create url
    const url=`http://localhost:3000/update-password/${token}`;
    //send mail
    await mailSender(email,"Password Reset Link",`password reset link:${url}`)

    //return response
    return res.json({
        success:true,
        message:"Email sent please changed password"
    })


}catch(error){
    console.log(error);
    return res.status(500).json({success:false,message:"Something Wrong while reset link genration",})

}

}

exports.resetPassword=async (req,res)=>{
    try{
    //data fetch
    const {password,confirmPassword,token}=req.body;

    //validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:'Password not matching'
        });
    }
    //get user details from token from db
    const userDetails=await User.findOne({token:token});

    //if no entry invalid token
    if(!userDetails){

        return res.json({
            success:false,
            message:'token not valid'
        });

    }
    //token times expires
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:'token expires'
        });
    }

    //hashpassword
    const hashedPassword=await bcrypt.hash(password,10);
    //update passowrd
    await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
    //return
    return res.status(200).json({
        success:true,
        message:"Password reset succesfull"
    })
}
catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"Error during password rest"
    })
}

}