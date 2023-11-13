const Category=require('../models/Category');

//create category handler

exports.createCategory=async (req,res)=>{
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
         const tagDetails=await Category.create({
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
exports.showAlllCategory=async (req,res)=>{
    try{
        const allTags=await Category.find({},{name:true,description:true})
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


//category page details

exports.categoryPageDetails=async (req,res)=>{
    try{
        //get category id
        const {categoryId}=req.body;
        //get specific 
        const specificCategory=await Category.find(categoryId).populate("courses").exec();

        //validation
        if(!specificCategory){
            return res.status(404).json({
                success:false,
                message:'Data not found'
            });
        }


        //get courses
        const diffCategory=await Category.find({
        _id:{$ne:categoryId},
        }).populate("courses").exec();


        // top selling HW--> do it urself

        //return res
        return res.status(200).json({
            success:true,
            data:{
                specificCategory,
                diffCategory,
                topSelling
            }
        });


    }catch(error){

        return res.status(500).json({
            success:false,
            message:'Something went wrong'
        });

    }
}