const mongoose=require('mongoose');

require('dotenv').config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGOURL,{
        useNewUrlParse:true,
        useUnifiedTopology:true,
    }).then(
        ()=>{
            console.log('DB CONNECTED')
        }
    ).catch((e)=>{
        console.log("DB UNSUCESSFULL");
        console.log(e);
        process.exit(1);
    })
}