const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    'name':{
        type:String,
        required:true,  
    },
    
},{versionKey:false})
module.exports=mongoose.model('catagorymodel',categorySchema )
console.log('catagory model is ready')