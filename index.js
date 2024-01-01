const express = require('express');
const mongoose = require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 8000;


const app=express();

dotenv.config();





app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); //solves the corp error :)
app.use(express.static(path.join(__dirname,"/client/build")))
app.use('/api/images',express.static(path.join(__dirname,"public/images/")));


const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"public/images");
    },
    filename : (req,file,cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({storage});
app.post('/api/upload',upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("File uploaded Successfully!");
    }catch(err)
    {
        console.log(err);
    }
})



mongoose.connect(process.env.MONGO_URL,{useNewUrlParser : true}).then(()=>{console.log("database Connected!")}).catch((err)=>{console.log("Database Error!")});

app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

app.get('/*',()=>{
    res.sendFile(__dirname+'/client/build/index.html');
})

app.listen(PORT,()=>{
    console.log("Server started successfully!");
})