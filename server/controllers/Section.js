const Section=require('../models/Section');
const Course=require('../models/Course');

exports.createSection=async (req,res)=>{
    try{
        //data fetch
        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName||!courseId){
               return res.status(400).json({
                success:false,
                message:"All required"
               })
        }
        //create section
        const newSection=await Section.create({sectionName});
        //update course add section to course
        const updateCourseDetails =await Course.findByIdAndUpdate(
            courseId,{
                $push:{
                    courseContent:newSection._id,
                }
            },{new:true},
        );
        //hw use populate to replace section/subection in updated details
        //return response
        return  res.status(200).json({
            success:true,
            message:"section created",
            updateCourseDetails,
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            messagae:"something wrong",

        })

    }
}

exports.updateSection=async (req,res)=>{
    try{

        //data fetch
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName||!sectionId){
               return res.status(400).json({
                success:false,
                message:"All required"
               })
        }
        //data update
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return res
        return  res.status(200).json({
            success:true,
            message:"section updated",
            updateCourseDetails,
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            messagae:"something wrong",

        })
    }
}

exports.deleteSection=async (req,res)=>{
    try{
        //get id id in params
        const {sectionId}=req.params||req.body;
        //use find and delete
        await Section.findByIdAndDelete(sectionId);
    /// todo do we need to delete the section from course schema
        //return res
        return  res.status(200).json({
            success:true,
            message:"section deleted",
            updateCourseDetails,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            messagae:"something wrong",

        })
    }

}