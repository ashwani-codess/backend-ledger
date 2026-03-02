const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must associate with an accoun"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must associate with to account"],
        index: true
    },
status: {
    type: String,
    enum: {
        values: ["pending", "completed", "reversed", "failed"],
        message: "status must be either pending , completed , failed or reversed"
    },
    default: "pending"
},

    amount: {
        type: Number,
        required: [true, "amount is required for creating a transaction "],
        min: [0, "transaction can not be nragtive"]
    },

    idempotencyKey:{  //ye key same transaction ko do baar hone se rokti hai , backend generate nhi krta hai isko
        type:String,
        required:[true, "Idempotency key is required for creating a transaction "],
        index:true,
        unique:true
    }

},{
    timestamps:true
})


const transactionModel= mongoose.model("transaction", transactionSchema);

module.exports= transactionModel