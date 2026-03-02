const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authMiddleware(req, res, next) {
    const token = req.cookies.jwt_token || req.headers.authorisation?.split("")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorised access , token is missing"
        })

    }

    const isTokenBlacklisted= await tokenBlacklistModel.findOne({token })
    if(isTokenBlacklisted){
        return res(401).json({
            message:"unauthorised acess , token is invalid"
        })
    }

    //ab gar token mil gya to check krenge kya wo original token hai bhui ya nhi ya user ne kuch bhi token khud se bna diya


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorised access , token is INVALID"
        })

    }
}

 async function  authSystemUserMiddleware(req, res, next){
    const token = req.cookies.jwt_token || req.headers.authorisation?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Unauthorised acess , token is missing "
        })
    }

        const isTokenBlacklisted= await tokenBlacklistModel.findOne({token })
    if(isTokenBlacklisted){
        return res(401).json({
            message:"unauthorised acess , token is invalid"
        })
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        const user = await  userModel.findById(decoded.userId).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, needs to be SYSTEM USER"
            })
        }

        req.user= user;
        return next()
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorised acess, token is invalid"
        })
    }

 }
module.exports={authMiddleware, authSystemUserMiddleware}