const mongoose= require("mongoose");

const tokenBlacklistShema= new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to black list"],
        unique:[true]
    }

},    {
        timestamps:true
    })

    tokenBlacklistShema.index({createdAt:1},{
        expireAfterSeconds:60*60*24*3 //3 days
    })


    const tokenBlacklistModel= mongoose.model('tokenBlackList', tokenBlacklistShema)

    module.exports= tokenBlacklistModel