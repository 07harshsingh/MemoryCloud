const Folder = require("../models/Folder");

const createFolder = async (req,res,next) => {
    try{
       const {name} = req.body;
       if(!name){
        const error = new Error("Folder name required");
          error.statusCode = 400;
          return next(error)
       }
       const folder = await Folder.create({
           user : req.user._id,
           name
       })
       res.status(201).json({
         message : "Folder created successfully",
         data : {
            folder
         }
       })
    }catch(err){
        next(err);
    }
}
const getFolder = async (req,res,next) => {
    try{
       const folder = await Folder.find({user : req.user._id})
       res.status(200).json({
         data : {
            folder
         }
       })
    }catch(err){
       next(err)
    }
}

const getFolderById = async (req,res,next) => {
   try{
      const folder = await Folder.findById({user: req.user._id, _id: req.params.id});
      if(!folder){
          const error = new Error("Folder not found");
          error.statusCode = 404;
          return next(error)
      }
      res.status(200).json({
         data : {
            folder
         }
      })
   }catch(err){
      next(err)
   }
}

const deleteFolder = async(req,res,next) => {
    try{
       const folder = await Folder.findOneAndDelete({user : req.user._id, _id : req.params.id})
       if(!folder){
          const error = new Error("Folder not found");
          error.statusCode = 404;
          return next(error)
       }
       res.status(200).json({
        message : "Folder deleted successfully",
        data : {
            folder
        }
       })
    }catch(err){
       next(err);
    }
}

const updateFolder = async (req,res,next) => {
    try{
        const {name} = req.body;
       const folder = await Folder.findOneAndUpdate({user : req.user._id,  _id : req.params.id}, {name}, {new:true, runValidators:true})
       if(!folder){
          const error = new Error("Folder not found");
          error.statusCode = 404;
          return next(error)
       }
       res.status(200).json({
        message : "Folder updated successfully",
        data : {
            folder
        }
       })
    }catch(err){
       next(err);
    }
}

module.exports = {getFolder, getFolderById, deleteFolder, updateFolder, createFolder}