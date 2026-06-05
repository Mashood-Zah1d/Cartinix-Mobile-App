import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema =new  mongoose.Schema({
   username: {
     required : true,
     type : String,
     unique : true,
     lowercase : true,
     trim : true,
     index : true
    },


    email: {
     required : true,
     type : String,
     unique : true,
     lowercase : true,
     trim : true,
    },

    Fullname: {
     required : true,
     type : String,
     trim : true,
     index : true
    },

    avatar: {
     required : true,
     type : String,
    },
    
    password : {
       type : String,
       required : [true , "Password Is Required"]
    },

    refreshToken : {
        type : String
    }

},{timestamps : true})

userSchema.pre("save", async function(){
  if (!this.isModified("password")) return; 
  this.password= await bcrypt.hash(this.password,10);
})

userSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
        }
    )
}

const User = mongoose.model("User", userSchema);
export default User;