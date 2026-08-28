const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    verificationCode : {
        type : String
    },
    verificationCodeExpires : {
        type : Date
    },
    googleId : {
        type : String
    }
},{timestamps : true})

module.exports = mongoose.model("User", userSchema);