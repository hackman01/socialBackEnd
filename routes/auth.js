const authRoute = require('express').Router();
const userModel = require('../models/User');
const bcrypt = require('bcrypt');


authRoute.post('/register',async (req,res)=>{
    
    const {username, email, password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

   req.body.password=hashedPassword;
    
    const user = new userModel(req.body);

    await user.save().then(()=>{
        res.status(200).json(user);
    }).catch((err)=>{console.log(err);});


})

authRoute.post('/login', async (req,res) => {
    
    try{

        const user = await userModel.findOne({email:req.body.email});
        !user && res.status(404).json({message:"User Not found"});
        
        const validPass = await bcrypt.compare(req.body.password,user.password);
        !validPass && res.status(400).json({message:"Wrong Password!"});
    
        res.status(200).json(user);

    }
    catch(err) {
        console.log(err);
    }
})



module.exports = authRoute;