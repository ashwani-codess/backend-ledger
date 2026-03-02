
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_USER,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//     },
// });

// // Verify the connection configuration
// transporter.verify((error, success) => {
//     if (error) {
//         console.error('Error connecting to email server:', error);
//     } else {
//         console.log('Email server is ready to send messages');
//     }
// });

// module.exports = transporter;



// // Function to send email
// const sendEmail = async (to, subject, text, html) => {
//     try {

//         const info = await transporter.sendMail({
//             from: `"ASH ENTERPRISES" <${process.env.EMAIL_USER}>`, // sender address
//             to,       // list of receivers
//             subject,  // subject line
//             text,     // plain text body
//             html,     // html body
//         });

//         console.log('Message sent: %s', info.messageId);
//         console.log(
//             'Preview URL: %s',
//             nodemailer.getTestMessageUrl(info)
//         );

//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// module.exports = sendEmail;


// async function sendRegistrationEmail(userEmail, name) {
//     const subject = "Welcome to Ash Enterprises";

//     const text = `Hello ${name},

// Thank you for registering with Ash Enterprises.
// We are delighted to have you on board and look forward to supporting you.

// If you have any questions or need assistance, please feel free to reach out to us.

// Best Regards,
// Ash Enterprises Team`;
//     const html = `
//   <div style="font-family: Arial, sans-serif; color:#333; line-height:1.5;">

//     <p>Hello ${name},</p>

//     <p>
//       Welcome to <strong>Ash Enterprises</strong>! 
//       Thank you for registering with us. We’re happy to have you on board.
//     </p>

//     <p>
//       If you need any assistance, feel free to contact our support team anytime.
//     </p>

//     <br/>

//     <p>
//       Best Regards,<br/>
//       <strong>Ash Enterprises Team</strong>
//     </p>

//   </div>
// `;


// async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    
//     const subject = "Transaction Successful - Ash Enterprises";

//     const text = `Hello ${name},

// Your transaction has been successfully processed.

// Amount Transferred: ₹${amount}
// Transferred To Account: ${toAccount}

// If you did not initiate this transaction, please contact our support team immediately.

// Thank you for choosing Ash Enterprises.

// Best Regards,
// Ash Enterprises Team`;

//     const html = `
//     <div style="font-family: Arial, sans-serif; color:#333; line-height:1.6; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
      
//       <h2 style="color:#2c3e50;">Transaction Successful ✅</h2>

//       <p>Hello <strong>${name}</strong>,</p>

//       <p>Your transaction has been successfully processed. Below are the details:</p>

//       <div style="background:#f8f9fa; padding:15px; border-radius:6px; margin:15px 0;">
//         <p><strong>Amount Transferred:</strong> ₹${amount}</p>
//         <p><strong>Transferred To Account:</strong> ${toAccount}</p>
//         <p><strong>Status:</strong> <span style="color:green;">Success</span></p>
//       </div>

//       <p>If you did not authorize this transaction, please contact our support team immediately.</p>

//       <br/>

//       <p>
//         Best Regards,<br/>
//         <strong>Ash Enterprises Team</strong>
//       </p>

//     </div>
//     `;

//     return { subject, text, html };
// }
// await sendEmail(userEmail, subject, text , html);
// }   

// module.exports={
//     sendRegistrationEmail,
//     sendTransactionEmail
// }


const nodemailer = require("nodemailer");


// transporter
const transporter = nodemailer.createTransport({

 service:"gmail",

 auth:{
   type:"OAuth2",
   user:process.env.EMAIL_USER,
   clientId:process.env.CLIENT_ID,
   clientSecret:process.env.CLIENT_SECRET,
   refreshToken:process.env.REFRESH_TOKEN,
 }

});


// verify connection
transporter.verify((error)=>{

 if(error){
   console.log("Email server error:",error);
 }else{
   console.log("Email server ready");
 }

});


// common email sender
async function sendEmail(to,subject,text,html){

 try{

   const info = await transporter.sendMail({

     from:`"ASH ENTERPRISES" <${process.env.EMAIL_USER}>`,
     to,
     subject,
     text,
     html

   });

   console.log("Mail Sent:",info.messageId);

 }
 catch(err){

   console.error("Email error:",err);

 }

}


// Registration Email
async function sendRegistrationEmail(userEmail,name){

 const subject="Welcome to Ash Enterprises";

 const text=`Hello ${name},

Thank you for registering with Ash Enterprises.
`;

 const html=`

 <h3>Hello ${name}</h3>

 <p>Welcome to <b>Ash Enterprises</b></p>

 `;


 await sendEmail(
   userEmail,
   subject,
   text,
   html
 );

}



// Transaction Email
async function sendTransactionEmail(
 userEmail,
 name,
 amount,
 toAccount
){

 const subject="Transaction Successful";

 const text=`

Hello ${name}

Amount : ₹${amount}

Account : ${toAccount}

 `;

 const html=`

<h2>Transaction Successful ✅</h2>

<p>${name}</p>

<p>Amount ₹${amount}</p>

<p>Account ${toAccount}</p>

 `;


 await sendEmail(
   userEmail,
   subject,
   text,
   html
 );

}



module.exports={

 sendRegistrationEmail,
 sendTransactionEmail

};