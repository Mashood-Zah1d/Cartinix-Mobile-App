import User from '../Model/User.Model.js'
import { asyncFuction } from '../Utils/asyncFunction.js'
import apiError from '../Utils/apiError.js'
import { uploadonCloudinary } from '../Utils/Cloudinary.js'
import apiResponse from '../Utils/apiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose, { Mongoose } from 'mongoose'

const GenerateTokens = async function (userId) {
    try {
        const user = await User.findById(userId)
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken }

    } catch (error) {
  throw new apiError(500, error.message)
    }

}

export const Register = asyncFuction(async (req, res) => {
    console.log(req.body);
    
    const { username, email, Fullname, password } = req.body;

    if ([username, email, Fullname, password].some((feild) => feild?.trim() === "")) {
        throw new apiError(400, "Incomplete Details");
    }
    const isUser = await User.findOne({
        $or: [{ username }, { email }]

    })

    if (isUser) {
        throw new apiError(400, "Account Already Exist")
    }


    let avatar = req.files?.avatar[0]?.path;

    if (!avatar) {
        throw new apiError(400, "Avatar Needed")
    }

    avatar = await uploadonCloudinary(avatar);

    if (!avatar) {
        throw new apiError(500, "System Haulted Uploading File Retry")
    }

    const user = await User.create({
        username, email, Fullname, password, avatar
    }
    )

    const createdUser = await User.findOne({ _id: user._id }).select("-password -refreshToken")


    res.status(200).json(
        new apiResponse(200, createdUser, "Account Created Successfully"))
})

export const Login = asyncFuction(async (req, res) => {
    // get data
    // check data exist 
    // check if user exist
    //if not error
    // if exist check password 
    // if wrong return error
    // if correct generate token 
    // send token as cookies
    console.log(req.body);

    const { username = " ", email = " ", password = " " } = req.body;

    if (!(username || email) && !password) {
        throw new apiError(400, "Please Enter Complete Data");
    }


    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(400, "User Dosent Exists ! Signup First ");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new apiError(400, "Please Enter Correct Password");
    }

    const { accessToken, refreshToken } = await GenerateTokens(user._id);

    const loggedinUser = await User.findById(user._id).select(" -refreshToken -password");

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .json(new apiResponse(200, {
            user: loggedinUser,
            accessToken,
            refreshToken
        },
            "User Logged In Successfully"
        ))

})

export const logout = asyncFuction(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User Logged Out"))
})