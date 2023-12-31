const jwt=require('jsonwebtoken')
require('dotenv').config();
const User=require('../models/User')

//auth 
exports.auth=async (req,res,next)=>{
    try{
        //extract token
        const token=req.cookies.token||req.body.token
                    ||req.header("Authorization").replace("Bearer ","");
        
        
       //if token missing
       if(!token){
        return res.status(401).json({
            success:false,
            message:"Token not found"
        })
       }       
       
       //verify Token
       try{
        const decode= jwt.verify(token,process.env.JWT_SECRET);
        console.log("decode",decode);
        req.user=decode;

       }catch(error){
        //verification isseu
        console.log(error,"error")
        return res.status(401).json({
            success:false,
            message:"Token not valid"
        })

       }
       next();


    


    }catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong for token validation"
        })

    }
}

//isstudent

exports.isStudent=async (req,res,next)=>{
    try{
        if(req.user.accountType!=='Student'){
            return res.status(401).json({
                success:false,
                message:"For student only"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role not valid"
        })
    }
}


//isinstructor
exports.isInstructor=async (req,res,next)=>{
    try{
        console.log("user printing",req.user);
        if(req.user.accountType!=='Instructor'){
            return res.status(401).json({
                success:false,
                message:"For Instructor only"
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role not valid"
        })
    }
}


//isadmin
exports.isAdmin = async (req, res, next) => {
    try {
        console.log(req.user.accountType);
        if (req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: "For Admin only"
            });
        }
        // If the user is an admin, call next() to proceed to the next middleware or route handler.
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role not valid"
        });
    }
};
