const SubSection=require('../models/SubSection');
const Section=require('../models/Section');
const {uploadImageToCloudinary}=require('../utils/imageUploader')

//create subsection

exports.createSubSection=async (req,res)=>{
    try{
        //fetch data from body
        const {sectionId,title,timeDuration,description}=req.body;

        //extract file/video
        const video=req.files.videoFiles;

        //validation
        if(!sectionId||!title||!timeDuration||!description||!video){
            return res.status(400).json({
                succes:false,
                message:"all required"
            })
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const newSubSection=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with id of this subsection
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:newSubSection._id,
            }
        },{new:true});

       //HW:log updated section here, after adding populate query



        //return response

        return res.status(500).json({
            success:true,
            message:"sub section done",
            updatedSection,

        })

    }catch(error){
        return res.status(500).json({
            succes:false,
            message:"something went wrong"
        })
    }
}

//HW UPDATE SUBSECTION 

//HW DELETE SUBSECTION

