import User from "../Model/User.Model.js";
import apiError from "../Utils/apiError.js";
import { asyncFuction } from "../Utils/asyncFunction.js";
import jwt from 'jsonwebtoken';

export const verifyJwt = asyncFuction(async (req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     if (!token) {
         throw new apiError(401,"Unauthorized User");  
     }
     
    const decodeToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)
    
    const user = await User.findById(decodeToken._id).select("-password -refreshToken");
     
    if (!user) {
     throw new apiError(400,"User Not Found");
    }
 
    req.user = user;
 
    next();
   } catch (error) {
    throw new apiError(500,error.message);
   }
})