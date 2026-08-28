const File = require("../models/File");
const cloudinary = require("../config/cloudinary");

const uploadFile = async (req,res,next) => {
    try{
       if(!req.files || req.files.length === 0){
          const error = new Error("Select any file to upload");
          error.statusCode = 400;
          return next(error);
       }

       let uploadedFiles = [];
       for(const file of req.files){
          const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({folder : `MemoryCloud/${req.user._id}/${req.params.folderId}`, resource_type: "image"}, 
               (err,result) => {
                  if(err){
                    reject(err);
                  }
                  else{
                    resolve(result)
                  }
               }
          )

          stream.end(file.buffer);

       })

       const savedFile = await File.create({
          user : req.user._id ,
          folder : req.params.folderId ,
          originalName : file.originalname ,
          url : result.secure_url ,
          publicId : result.public_id ,
          resourceType : result.resource_type ,
          size : file.size
       })

       uploadedFiles.push(savedFile);
       }

       res.status(201).json({
         message : "File uploaded successfully",
         data : {
            files : uploadedFiles
         }
       })
    }catch(err){
       next(err);
    }
}

const getFiles = async(req,res,next) => {
    try{
       const files = await File.find({user:req.user._id, folder:req.params.folderId})
       res.status(200).json({
          data : {
            files
          }
       })
    }catch(err){
       next(err)
    }
}

const deleteFile = async (req,res,next) => {
    try{
      console.log("DELETE FILE ID:", req.params.id);
       const file = await File.findOne({user:req.user._id, _id:req.params.id});
       if(!file){
          const error = new Error("File not found");
          error.statusCode = 404;
          return next(error);
       }

       await cloudinary.uploader.destroy(file.publicId, {resourceType: file.resourceType});

       await File.findByIdAndDelete(file._id)

       res.status(200).json({
         message : "File deleted successfully",
         data : {
            file
         }
       })
    }catch(err){
       next(err);
    }
}

module.exports = {uploadFile, getFiles, deleteFile} ;