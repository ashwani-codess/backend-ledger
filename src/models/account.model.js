const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");

const accountSchema = new mongoose.Schema({

 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"user",
  required:[true,"Account must be associated with a user"],
  index:true
 },

 status:{
  type:String,
  enum:{
   values:["ACTIVE","CLOSED","FROZEN"],
   message:"Account can either be active closed or frozen"
  },
  default:"ACTIVE"
 },

 currency:{
  type:String,
  required:[true,"currency is required to create new account"],
  default:"INR"
 }

},{timestamps:true});

accountSchema.index({user:1,status:1});


accountSchema.methods.getBalance = async function(){

 const balanceData = await ledgerModel.aggregate([
  { $match:{ account:this._id } },
  {
   $group:{
    _id:null,
    totalDebit:{
     $sum:{
      $cond:[
       {$eq:["$type","DEBITED"]},
       "$amount",
       0
      ]
     }
    },
    totalCredit:{
     $sum:{
      $cond:[
       {$eq:["$type","CREDITED"]},
       "$amount",
       0
      ]
     }
    }
   }
  },
  {
   $project:{
    _id:0,
    balance:{ $subtract:["$totalCredit","$totalDebit"] }
   }
  }
 ]);

 if(balanceData.length === 0) return 0;

 return balanceData[0].balance;

};

const accountModel =
 mongoose.model("account", accountSchema);

module.exports = accountModel;