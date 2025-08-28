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
    console.log(req.body);
    try {
        const user = await userModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(400).json({message: "Wrong password!"});
        }
        
        // If we get here, login was successful
        // You might want to generate a token here if you're using JWT
        const {password, ...others} = user._doc;
        res.status(200).json(others);
        
    } catch(err) {
        console.error('Login error:', err);
        res.status(500).json({message: 'Internal server error'});
    }
})



module.exports = authRoute;