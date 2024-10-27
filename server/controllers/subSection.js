const SubSection=require('../models/SubSection');
const Section=require('../models/Section');
const {uploadImageCloudinary}=require('../utils/imageUploader')

//create subsection

// Create a new sub-section for a given section
// exports.createSubSection = async (req, res) => {
//   try {
//     // Extract necessary information from the request body
//     const { sectionId, title, description } = req.body
//     const video = req.files.video

//     // Check if all necessary fields are provided
//     if (!sectionId || !title || !description || !video) {
//       return res
//         .status(404)
//         .json({ success: false, message: "All Fields are Required" })
//     }
//     console.log(video)

//     // Upload the video file to Cloudinary
//     const uploadDetails = await uploadImageCloudinary(
//       video,
//       process.env.FOLDER_NAME
//     )
//     console.log(uploadDetails)
//     // Create a new sub-section with the necessary information
//     console.log('creating subsection');
//     const SubSectionDetails = await SubSection.create({
//       title: title,
//       timeDuration: `${uploadDetails.duration}`,
//       description: description,
//       videoUrl: uploadDetails.secure_url,
//     })

//     console.log('created now update');

//     // Update the corresponding section with the newly created sub-section
//     const updatedSection = await Section.findByIdAndUpdate(
//       { _id: sectionId },
//       { $push: { subSection: SubSectionDetails._id } },
//       { new: true }
//     ).populate("subSection")

//     // Return the updated section in the response
//     return res.status(200).json({ success: true, data: updatedSection })
//   } catch (error) {
//     // Handle any errors that may occur during the process
//     console.error("Error creating new sub-section:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     })
//   }
// }

exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description, questions } = req.body;
    const video = req.files.video;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res.status(404).json({ success: false, message: "All Fields are Required" });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageCloudinary(video, process.env.FOLDER_NAME);

    // Create a new sub-section with the necessary information
    const subSectionData = {
      title,
      timeDuration: `${uploadDetails.duration}`,
      description,
      videoUrl: uploadDetails.secure_url,
    };

    // If questions are provided and not empty, create a Quiz
    if (questions && questions.length > 0) {
      const quizData = {
        questions: JSON.parse(questions)  // Assuming questions are sent as a JSON string
      };
      const newQuiz = await Quiz.create(quizData);
      subSectionData.quiz = newQuiz._id;  // Link the Quiz to the SubSection
    }

    // Create the new SubSection
    const SubSectionDetails = await SubSection.create(subSectionData);

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection });

  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


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