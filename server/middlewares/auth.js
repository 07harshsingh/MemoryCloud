const jwt = require("jsonwebtoken");

const auth = async (req,res,next) => {
    try{
      const authHeader = req.headers.authorization ;
      if(!authHeader || !authHeader.startsWith("Bearer ")){
          const error = new Error("Invalid token");
          error.statusCode = 401;
          return next(error);
      }
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    }catch(err){
       next(err);
    }
}

module.exports = auth;