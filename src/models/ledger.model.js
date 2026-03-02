const mongoose =  require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        requires:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating ledger entry"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:"true",
        immutable:"true",
        index:'true'
    },
    type:{
        type:String,
        enum:{
            values:["CREDITED", "DEBITED"],
            message:"type can be CREDITED or DEBITED"
        },
        immutable:true,
        required:[true,"Ledger type is required"]

    }

})

function preventLedgerModification(){
    throw new Error("ledger entries are immuatble and can not be modified or deleted")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
ledgerSchema.pre('updateOne', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification)
ledgerSchema.pre('deleteMany', preventLedgerModification)
ledgerSchema.pre('deleteOne', preventLedgerModification)
ledgerSchema.pre('remove', preventLedgerModification)
ledgerSchema.pre('findOneAndReplace', preventLedgerModification)
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)



const ledgerModel = mongoose.model("ledger", ledgerSchema);



module.exports= ledgerModel