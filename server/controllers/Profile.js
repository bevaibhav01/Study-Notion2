import Profile from "../models/Profile";

import User from '../models/User';


export async function updateProfile(req,res){
    try{
        //get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;

        //get user id
        const id=req.user.id;

        //validation

        if(!gender||!contactNumber||!id){
            return res.status(200).json({
                success:false,
                message:"went wrong"
            })
        }
        //find profile
        const  userDetails=await User.findById({id});
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);

        //update profile
        profileDetails.dateOdfBirth=dateOfBirth;
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;
        profileDetails.about=about;

        //save in db the change
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"True",
            profileDetails
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"went wrong"
        })
        
    }
}

//delete account 

exports.deleteAccount=async (req,res)=>{
    try{
        //get id
        const id=req.user.id;
        //validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        //delete profile

        //if not works use {_id:user-// same}
        await Profile.findByIdAndDelete(userDetails.additionalDetails); 
        //delete user
        await User.findByIdAndDelete(id);
        
        //todo HW UNENROLL USER FROM ENROLL COURSES ABOVE DELETE
        //explore -> crone job 
        //return response
        return res.status(200).json({
            success:true,
            message:"Deleted Succesfully"
        });


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        });
    }
}