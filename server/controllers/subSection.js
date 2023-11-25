const SubSection=require('../models/SubSection');
const Section=require('../models/Section');
const {uploadImageCloudinary}=require('../utils/imageUploader')

//create subsection

exports.createSubSection=async (req,res)=>{
    try{
        //fetch data from body
        const {sectionId,title,timeDuration,description}=req.body;

        //extract file/video
        const video=req.files.video;

        //validation
        if(!sectionId||!title||!timeDuration||!description||!video){
          console.log(sectionId,title,timeDuration,description,video);
            return res.status(400).json({
                succes:false,
                message:"all required"
            })
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageCloudinary(video,process.env.FOLDER_NAME);
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
      console.log(error);
        return res.status(500).json({
            succes:false,
            message:"something went wrong"
        })
    }
}

//HW UPDATE SUBSECTION 

exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  

//HW DELETE SUBSECTION

exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }