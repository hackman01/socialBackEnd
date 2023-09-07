const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    
    userId:{
        type:String,
        required:true
    },
    desc : {
        type:String
    },
    img:{
        type:String,
        default:""
    },
    likes : { 
        type : Array,
    },
    comments : {
        type : Array
    }

}, { timestamps : true } );

module.exports = mongoose.model("Post",postSchema);