const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    folder : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Folder",
        required : true
    },

    originalName : {
        type : String,
        required : true
    },

    url : {
        type : String,
        required : true
    },

    publicId : {
        type : String,
        required : true
    },

    resourceType : {
        type : String,
        required : true
    },

    size : {
        type : Number,
        required : true
    }

}, { timestamps : true });

module.exports = mongoose.model("File", fileSchema);