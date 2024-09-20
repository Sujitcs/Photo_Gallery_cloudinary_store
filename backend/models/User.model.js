const mongoose = require('mongoose');
const userschema= new mongoose.Schema({
    'email':{
        type:String,
        required:true,
        unique:true
    },
    'password':{
        type:String,
        required:true
    },
    'name':{
        type:String,
        required:true
    },
    
},{versionKey:false})
module.exports=mongoose.model('usermodel',userschema)
console.log('user model is ready')