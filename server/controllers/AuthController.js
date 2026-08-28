const User = require("../models/User");
const bcrypt = require("bcrypt");
const transporter = require("../config/email");
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

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const verificationCodeExpires = new Date(Date.now() + 10*60*1000);

      const user = await User.create({
        username,
        email,
        password : hashPassword,
        verificationCode,
        verificationCodeExpires
      })

     await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : email,
        subject : "Memory Cloud verification code",
        html : `
               <h2>MemoryCloud Email Verification</h2>
               <p>Your verification code is:</p>
               <h1>${verificationCode}</h1>
               <p>This code will expire in 10 minutes.</p>
               `
        })

      res.status(201).json({
        message : "User registered successfully, Check your email for verification code"
      })

    }catch(err){
        next(err);
    }
}


const verifyEmail = async (req,res,next) => {
    try{
       const {email, verificationCode} = req.body;
       if(!email || !verificationCode){
        const error = new Error("Both fields required");
         error.statusCode = 400;
         return next(error);
       }

       const userExist = await User.findOne({email});
       if(!userExist){
         const error = new Error("User not exists");
         error.statusCode = 400;
         return next(error);
       }

       if(userExist.isVerified){
         const error = new Error("User already verified");
         error.statusCode = 400;
         return next(error);
       }

       if(userExist.verificationCode !== verificationCode){
         const error = new Error("Verification code is incorrect");
         error.statusCode = 400;
         return next(error);
       }

       if(!userExist.verificationCodeExpires || userExist.verificationCodeExpires < new Date()){
         const error = new Error("Verification code expired");
         error.statusCode = 400;
         return next(error);
       }

       userExist.isVerified = true;
       userExist.verificationCode = undefined;
       userExist.verificationCodeExpires = undefined;

       await userExist.save();

       res.status(200).json({
        message : "Email verified successfully"
       })
    }catch(err){
       next(err)
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

       if(!user.isVerified){
        const error = new Error("Please verify your email first");
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
             isVerified : true
         })
       }

       if(!user.googleId){
          user.googleId = googleId,
          user.isVerified = true,

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

module.exports = {registerUser, verifyEmail, loginUser, googleLogin};