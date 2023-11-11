const Tag=require('../models/Tag');

//create tag handler

exports.createTag=async (req,res)=>{
    try{
        //fetch data
         const {name,description}=req.body;

          //validation
         if(!name||!description){
            return res.status(401).json({
                success:false,
                message:'All field require',
            })
         }

         //db entry
         const tagDetails=await Tag.create({
            name:name,description:description,
         });
         console.log(tagDetails);

         //return response
         return res.status(200).json({
            success:true,
            message:'Tag created',
         });




    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//get all tags handler
exports.showAlllTags=async (req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true})
        res.status(200).json({
            success:true,
            message:"All tage returned",
            allTags
        })   
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}