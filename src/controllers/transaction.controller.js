/**
 * 1. request flow
 * 2. Validate idempotency key
 * 3. check account status
 * 4.derive sender balance from the ledger
 * 5.Create transaction(PENDING)
 * 6. create DEBIT ledger entry
 * 7.create CREDIT ledger entry
 * 8.Mark transaction COMPLETED
 * 9. commit MongoDB session
 * 10.send email notification
 */
const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const mongoose= require("mongoose")
const emailService=require("../services/email.service")
const { promises } = require("nodemailer/lib/xoauth2")


async function createTransaction(req, res) {

// 1. request flow    
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !idempotencyKey || !amount) {
        return res.status(400).json({
            message: "fromAccount , toAccount , amount , idempotencyKey are required"
        })
    }
    //ab ye check  krte h ki from or 2 account exists bhi krt h ya nhi ?
    const fromUserAccount = await accountModel.findOne({ _id: fromAccount }) //user accounts ki id dega
    const toUserAccount = await accountModel.findOne({ _id: toAccount })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "invalid fromAccount ot toAccount"
        })
    }


//2.validate idempotency key

// 

const isTransactionAlreadyExists =
  await transactionModel.findOne({ idempotencyKey });

if (isTransactionAlreadyExists) {

  if (isTransactionAlreadyExists.status === "completed") {
    return res.status(200).json({
      message: "transaction already processed",
      transaction: isTransactionAlreadyExists
    });
  }
 
  if (isTransactionAlreadyExists.status === "pending"){
    return res.status(200).json({
      message: "transaction is still processing"
    });
  }

if (isTransactionAlreadyExists.status === "failed"){
    return res.status(500).json({
      message: "transaction processing failed, please retry"
    });
  }

 if (isTransactionAlreadyExists.status === "reversed"){
    return res.status(500).json({
      message: "transaction was reversed, please retry"
    });
  }
}
//3.check account status

if(fromUserAccount.status!=="ACTIVE"  || toUserAccount.status!=="ACTIVE"){
    return res.status(400).json({
        message:"from and to account must be in active state"
    })
}

//4.derive sender balance from the ledger

const balance= await fromUserAccount.getBalance();
if(balance<amount){
   return  res.status(400).json({
        message:`insufficient balance in fromAccount. Current balance is ${balance}. Requested amount is ${amount}`
    })
}

let transactionArr;
try{
// 5.Create transaction(PENDING)
const session = await mongoose.startSession()
session.startTransaction()  //iske baad hm kuch bhi krte hai to ya to wo sb kuch complete hoga ya kuch bhi nhi save hoga db me


// const transaction = new transactionModel({
//     fromAccount, 
  
//     toAccount,
//       amount, 
//       idempotencyKey,
//       status:"pending"
// },{ session })

transactionArr = await transactionModel.create([{
  fromAccount,
  toAccount,
  amount,
  idempotencyKey,
  status: "pending"
}], { session });

const transaction = transactionArr[0];

const debitLedgerEntry= await ledgerModel.create([{
    account:fromAccount,
   
    amount:amount,
    transaction:transaction._id,
    type:"DEBITED"


}],{session})

await new Promise(resolve =>
setTimeout(resolve,15000)
)
const creditLedgerEntry= await ledgerModel.create([{
    account:toAccount,
   
    amount:amount,
    transaction:transaction._id,
    type:"CREDITED"


}],{session})

await transactionModel.findByIdAndUpdate(
    transaction._id,
    {status:"completed"},
    {session}
)

 await session.commitTransaction();
 session.endSession()



 //10.send email notification
await emailService.sendTransactionEmail(req.user.email, req.user.name,amount , toAccount )
 return res.status(201).json({
    message:"transaction completed successfully",
    transaction: transaction
 })
 
}catch(error){
    console.log(error);   // 👈 add this
    return res.status(400).json({
        message:"TRANSACION IS PENDING DUE TO SOME ISSUE , PLEASE RETRY AFTER SOME TIME"
    })
}
}

async function createInitialFundsTransaction(req, res){
    const {toAccount, amount, idempotencyKey} = req.body
        if (!toAccount || !amount || !idempotencyKey || !amount) {
        return res.status(400).json({
            message: "amount , toAccount  , idempotencyKey are required"
        })
    }
    const toUserAccount = await accountModel.findOne({ _id: toAccount })

    if ( !toUserAccount) {
        return res.status(404).json({
            message: "invalid fromAccount ot toAccount"
        })
    }

    const fromUserAccount= await accountModel.findOne({
        // systemUser:true,
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"system user account not found"
        })
    }

    const session = await mongoose.startSession()
session.startTransaction()  //iske baad hm kuch bhi krte hai to ya to wo sb kuch complete hoga ya kuch bhi nhi save hoga db me


const transaction = new transactionModel({
    fromAccount:fromUserAccount._id, 
  
    toAccount,
      amount, 
      idempotencyKey,
      status:"PENDING"
})

const debitLedgerEntry= await ledgerModel.create([{
    account:fromUserAccount._id,
   
    amount:amount,
    transaction:transaction._id,
    type:"DEBITED"


}],{session})
const creditLedgerEntry= await ledgerModel.create([{
    account:toAccount,
   
    amount:amount,
    transaction:transaction._id,
    type:"CREDITED"


}],{session})

transaction.status="COMPLETE"
 await transaction.save({session})

 await session.commitTransaction();
 session.endSession()
 await emailService.sendTransactionEmail(req.user.email, req.user.name,amount , toAccount )
 return res.status(201).json({
    message:"Initial funds transaction completed successfully",
    transaction: transaction
 })
}


module.exports={createTransaction,createInitialFundsTransaction}