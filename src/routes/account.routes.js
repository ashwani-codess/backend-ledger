const accountModel= require("../models/account.model");
const express= require("express");
const authMiddleware= require("../middleware/auth.middleware")
const createAccountController= require("../controllers/account.controller")
const router= express.Router();

/**
 * -POST  /api/accounts
 * -create a new account
 * -protected route:login user hi accesskr sakta hai 
 */


router.post("/",authMiddleware.authMiddleware,createAccountController.createAccountController )
router.get("/",authMiddleware.authMiddleware,createAccountController.getUserAccountController)
router.get("/balance/:accountId",authMiddleware.authMiddleware,createAccountController.getAccountBalanceController)

module.exports= router;
