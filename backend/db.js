const mongoose = require ('mongoose')
const dotenv = require('dotenv');
dotenv.config();
const DBHOST = process.env.DBHOST;
//const db = 'mongodb://localhost:27017/photoadmin';
var con = mongoose.connect(DBHOST)
.then((data)=>{
    console.log('db connected to mongo atlas')
}).catch((err)=>console.error(err))

module.exports=con;
console.log('db ready');