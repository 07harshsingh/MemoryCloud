const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const googleClient = require("../config/google")

const registerUser = async (req,res,next) => {
    try{
      const {username, email, password, confirmPassword} = req.body;
      if(!username || !email || !password || !confirmPassword){
         const error = new Error("All fields required");
         error.statusCode = 400;
         return next(error);
      }

      if(password !== confirmPassword){
        const error = new Error("Passwords do not match");
         error.statusCode = 400;
         return next(error);
      }

      const alreadyRegistered = await User.findOne({email});
      if(alreadyRegistered){
        const error = new Error("User already registered");
         error.statusCode = 400;
         return next(error);
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password : hashPassword,
      })

      res.status(201).json({
        message : "User registered successfully"
      })

    }catch(err){
        next(err);
    }
}


const loginUser = async (req, res, next) => {
    try{
       const {email, password} = req.body;
       if(!email || !password){
         const error = new Error("Both field required");
         error.statusCode = 400;
         return next(error);
       }

       const user = await User.findOne({email});
       if(!user){
         const error = new Error("User not found");
         error.statusCode = 400;
         return next(error);
       }
       
       const existUser = await bcrypt.compare(password, user.password);
       if(!existUser){
         const error = new Error("Invalid password");
         error.statusCode = 401;
         return next(error);
       }
       
       const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});

       res.status(200).json({
          message : "User login successfull",
          data : {
            token
          }
       })
    }catch(err){
         next(err);
    } 
}

const googleLogin = async (req,res,next) => {
    try{
       const {credential} = req.body;
       if(!credential){
         const error = new Error("Credential not found");
         error.statusCode = 400;
         return next(error);
       }

       const ticket = await googleClient.verifyIdToken({
        idToken : credential,
        audience : process.env.GOOGLE_CLIENT_ID
       })

       const payload = ticket.getPayload();

       const {sub : googleId , email, name} = payload ;

       let user = await User.findOne({email});
       if(!user){
          user = await User.create({
             username : name,
             email,
             googleId,
         })
       }

       if(!user.googleId){
          user.googleId = googleId,

          await user.save();
       }
       
       const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
       
       res.status(200).json({
          message : "Google Login successfull",
          data : {
             token
          }
       })

    }catch(err){
         next(err);
    }
}

module.exports = {registerUser, loginUser, googleLogin};