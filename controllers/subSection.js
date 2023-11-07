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
        if(!sectionId||!title||!timeDuration||!description){
            return res.status(400).json({
                succes:false,
                message:"all required"
            })
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        c
        //update section with id of this subsection
        //return response

    }catch(error){

    }
}