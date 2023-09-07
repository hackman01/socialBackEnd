const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:true,
        unique:true,
        min : 3,
        max : 20
    },
    email : {
        type : String,
        required : true,
        unique:true
    },
    password : {
         type : String,
         required : true,
         min : 6
    },
    profilePic : {
        type : String,
        default : ""
    },
    coverPic : {
        type : String,
        default : ""
    },
    followers : {
        type : Array,
        default : []
    },
    followings : {
        type : Array,
        default : []
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    age : {
        type : Number,
       
    },
    relationship : {
        type : String,
        default : ""
    },
    workat: {
        type : String,
        default : ""
    }


}, { timestamps : true } );

module.exports = mongoose.model("User",userSchema);