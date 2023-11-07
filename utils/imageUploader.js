const coludinary=require('cloudinary').v2

exports.uploadImageCloudinary=async (file,folder,height,quality) =>{
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type='auto';

    return await coludinary.uploader.upload(file.tempFilePath,options);
    
}