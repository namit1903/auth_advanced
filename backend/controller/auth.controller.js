import crypto from 'crypto';
// import bcrypt from 'bcrypt';

import User from '../models/user.model.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import generateVerificationCode from '../utils/veficationCode.js'
import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import {sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail,sendWelcomeEmail} from '../mailtrap/email.js'



export const signup=async(req,res)=>{
  try{
    const {name,email,password} = req.body;
    const username=name;
    console.log(username, email, password)
    //check if exists
    if(!username || !email || !password){
      throw new Error('ALL FIELDS are required')
    }
    let user=await User.findOne({username});
    let mail=await User.findOne({ email});
    // if document already existed?
    if(user || mail){
      return res.status(400).json({
        success:false,
        message:"USER already exists!!"})
    }
    //in case its a new signup: user=undefined, email:undefined
    const salt=await bcrypt.genSalt(10);//manually generating the salt
    const hashedPassword=await bcrypt.hash(password,salt);
    //const hashedPassword=await bcrypt.hash(password,10);
const verificationCode=generateVerificationCode(); 

    //put this in database
    const newUser=new User({username,email,password:hashedPassword,
      verificationCode,
      isVerified:false,//this is false untill the user verifies their authenticity
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours; 3600000 miliseconds=1hr
    });


    // await newUser.save();//save before response
    // res.status(201).json({message:"User Registered successfully",
    //   verificationCode,
    //   verificationTokenExpiresAt:Date.now()+24*60*60*1000,//24 hrs
    //   username: newUser.username,
    //   email: newUser.email,
    //   isVerified: newUser.isVerified,
    // });
    // await newUser.save();
    //jwt
   await generateTokenAndSetCookie(res,newUser);
    // console.log("cookie wala token:",token);
    await sendVerificationEmail(newUser.email, verificationCode);
      // res.cookie('jwt',token,{httpOnly:true,secure:false,//means coockie will be sent over only https request
        // sameSite:'strict',//csrf
        // maxAge:3600000})
//maxAge is 1 hr
// res.send('jwt token is set as cookie');
// res.status(200).json({
//   success:true,
//   message: 'token is set as cookie',
//   user:{
//     ...newUser._doc,
//     password:undefined
//   }
// })
await newUser.save();//save before response
  }catch(e){
    console.log("signup gadbad",e);
    
    res.status(500).json({message:"SERVER EROOR",error:e.Error});
  }
}

export const verifyEmail = async(req, res) => {
  const{code}=req.body;
  try{
    const user = await User.findOne({
      isVerified :false,
      verificationCode:code,
      verificationTokenExpiresAt:{$gt:Date.now()},//if time is grater that current time to means that code is not expired
    })
if(!user){
  return res.status(400).json({message:"invalid user or expired code"})
}
user.isVerified=true;
//after verification , just delete the varification token ans verification code expireIn
user.verificationCode=undefined;
user.verificationTokenExpiresAt=undefined;
await user.save();

//now send the user a welcome email..that he is created
await sendWelcomeEmail(user.email,user.username)

res.status(200).json({
  success: true,
  message: "Email verified successfully",
  user: {
    ...user._doc,
    password: undefined,
  },
});
} catch (error) {
console.log("error in verifyEmail ", error);
res.status(500).json({ success: false, message: "Server error/ enter valid code" });
} 
}



export const login=async(req,res)=>{
  //input validation should be prefereed at frontend only , although we can do it at backend also
 try{
  const{email,password}=req.body;
  const user=await User.findOne({email});
console.log("login route",user);
  //lets do the credential checking
  if(!user) return res.status(404).json({message:"invalid email"});
  //compare the passwords
  const isMatch=await bcrypt.compare(password,user.password);
  console.log("isMatch:",isMatch);
if(!isMatch) return res.status(400).json({message:'Invalid password'});
//if everything is right
//genenrate JWT token
// const token=jwt.sign({userId:user._id},'secrete key',{
//   expiresIn:'1h'
// });   OR
generateTokenAndSetCookie(res,user);
user.lastLogin=new Date();
await user.save();

 }catch(error){
  console/log("login error",error)
  res.status(500).json({message:"user not registered"});
 }

}
export const forgetPassword=async(req,res)=>{
 
  const {email}=req.body;
  const user=await User.findOne({email});
  // console.log("hiiiii",user);
  if(!user) return res.status(400).json({message:"please enter valid Email"});
  //and id user exist then either return his original password or allow him to set a new password
//generate a token
const resetToken=crypto.randomBytes(20).toString("hex");
const resetTokenExpiresAt=Date.now()+3600000;
user.resetPasswordToken=resetToken;
user.resetPasswordExpiresAt=resetTokenExpiresAt;
console.log("after token creation",user);
await user.save();
await sendPasswordResetEmail(user.email,`http://localhost:5173/reset-password/${resetToken}`);
// await sendPasswordResetEmail(user.email,`process.env.CLIENT_URL/reser-password/${resetToken}`);
res.status(200).json({message:"suceesfully generated resetToken",
  user:user._doc
})

}
export const resetPassword=async(req,res)=>{
  const {oldpassword,newpassword,confirmpassword}=req.body;
  const {id}=req.params;
  try{
  const user=await User.findOne({
    resetPasswordToken:id,
    resetPasswordExpiresAt:{$gt:Date.now()}
  })
  if(!user) return res.status(400).json({
    message:"try again!! kuchh wr0ng hai..expired reset token"
  })
  const isMatch=await bcrypt.compare(oldpassword,user.password);
  if(!isMatch) return res.status(400).json({
    message:"Enter correct old password"
  })
  const hashedPassword=await bcrypt.hash(newpassword,10);
  user.password=hashedPassword;
  user.resetPasswordExpiresAt=undefined;
  user.resetPasswordToken=undefined;
  user.save();
  await sendResetSuccessEmail(user.email)
  res.status(200).json({
    message:"password updated succesfully"
  })}
  catch(error){
    res.status(500).json({message:"SERVER ERROR",
      error: error.message
    })
  }
}
export const logout=(req,res)=>{
  //simply instruct the client to remove the token (on the frontend side)
  //clear the token cookie
  res.clearCookie('token')
  res.status(200).json({message:'Logout succesfull'})
};

export const checkAuth = async (req, res) => {
  try {
    console.log("Request", req.userId);
    
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(403).json({ message: "User not found" });  // Added return
    }

    console.log("Checking authenticity", user.username);//WHY THIS IS PRINTED TWICE ALTHOUGH IT SHOULD BE PRINTED ONCE
    
    setTimeout(() => {
      console.log("Timer");
    }, 1000);

    return res.status(200).json({
      success: true,
      message: "User Found: authenticated",
      user,
    }); // Make sure to return here as well after sending response
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
    }); // Added return
  }
};

