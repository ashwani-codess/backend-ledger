const express = require('express');
const cookieParser = require("cookie-parser");

const authRouter =require('../src/routes/auth.routes');
const accountRouter= require("./routes/account.routes");
const transactionRouter= require('./routes/transaction.routes')

const app = express();

app.use(express.json());   // body read karega

app.use(cookieParser());   // 👈 cookies read karega

app.use("/api/auth", authRouter);

app.use("/api/accounts", accountRouter);

app.use("/api/transaction", transactionRouter);

module.exports = app;