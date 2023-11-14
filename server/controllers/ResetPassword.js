const User=require('../models/User')
const mailSender=require('../utils/mailSender');
const crypto=require('crypto');
const bcrypt=require('bcrypt')


//resetPasswordToken
//const crypto = require('crypto'); // Import the crypto module if not already done

exports.resetPasswordToken = async (req, res) => {
    try {
        // Get email from req body
        const email = req.body.email;

        // Check if the user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist',
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Update user by adding token and expiration date
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { token: token, resetPasswordExpires: 5 * 60 * 1000 },
            { new: true }
        );

        // Create URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send mail
        await mailSender(email, "Password Reset Link", `Password reset link: ${url}`);

        // Return response
        return res.json({
            success: true,
            message: "Email sent. Please check your email to reset the password.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password.",
        });
    }
};


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
    if(userDetails.resetPasswordExpires>Date.now()){
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