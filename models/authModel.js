const mongoose = require('mongoose');

const authModel =new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
})
module.exports = mongoose.model('authModel',authModel);
