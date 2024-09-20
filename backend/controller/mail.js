import nodemailer from 'nodemailer';
//create transporter-->jo new users ko mails bhejega
const transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'company ka email',
    pass:'company ka password',
  },
});
// it is an email delivery mechanism- defines the connection details to email service provider like gmail, smtp allows us to send email via NODE js 
// console.log("here is the transporter :",transporter)
//send the email verification email
const sendEmail=async(email,verificationCode)=>{
  const mailOptions={
    from:'company ka mail',
    to:email,
    subject:'Verification of the account',
    text:`your Varification code is ${verificationCode}`,
  }
}