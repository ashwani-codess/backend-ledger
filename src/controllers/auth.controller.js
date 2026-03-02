const express= require("express");
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService= require("../services/email.service")
const tokenBlacklistModel= require("../models/blacklist.model")
/** 
* - user register controller 
* - Post  /api/auth/register
*/
async function userRegisterController(req, res){
        const {email, password, name}= req.body;

        const isExists= await userModel.findOne({
            email:email
        })
        if(isExists){
            return res.status(422).json({
                message:"User already exists with this email",
                status:"failed"
            })
        }

        const user= await userModel.create({
            email, password , name
        })

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"3d"})

        res.cookie("jwt_token", token);
        res.status(201).json({
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            jwt_token:token
        })
        await emailService.sendRegistrationEmail(user.email, user.name)
}



/** 
* - user login controller 
* - Post  /api/auth/login
*/
async function userLoginController(req,res){
    const {email, name, password}= req.body ; 
     const user= await userModel.findOne({email}).select("+password");
     if(!user){
        return res.status(401).json({
            message:"email or password is invalid"
        })
     }
     //us email se registerd hai user isliye ab password check krenge
        const isValidPassword= await user.comparePassword(password)

     

     if(!isValidPassword){
                return res.status(401).json({
            message:"email or password is invalid"
        })
     }

             const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn:"3d"})

        res.cookie("jwt_token", token);
        res.status(200).json({
            message:"logged in successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            jwt_token:token
        })
}


async function userLogoutController(req,res){
    const token = req.cookies.jwt_token || req.headers.authorization?.split(" ")[1];
        if(!token){
        return res.status(400).json({
            message:"user logged  out successfully "
        })
    }

    res.clearCookie("jwt_token")

    await tokenBlacklistModel.create({
        token:token
    })
    res.status(200).json({
        message:"user logged out suces fully"
    })
}

module.exports={userRegisterController, userLoginController, userLogoutController}