const express=require('express');
const app=express();

const userRoutes=require('./routes/User');
const courseRouter=require('./routes/Course');

//const database=require('./config/database');
//install cors for frontend and backend communication
const { databaseConnecter } = require('./config/database');

const cookieparser=require('cookie-parser');

const cors=require('cors');

const {coludinartConnect, cloudinaryConnect}=require('./config/cloudinary')

const fileupload=require('express-fileupload');

const dotenv=require("dotenv");

dotenv.config();

const PORT=4000;

//db connect
//database.connect();

databaseConnecter();

//middlwares
app.use(express.json());
app.use(cookieparser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,

    })
)

app.use(
    fileupload({
        useTempFiles:true,
        tempFileDir:"/tmp",

    })
);

//cloudinary connection

cloudinaryConnect();


//roures

app.use('/api/v1/auth',userRoutes);
app.use("/api/v1/course",courseRouter);

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"Server running"
    })
})

app.listen(PORT,()=>{
    console.log("APP RUNNING AT ",PORT);

})

