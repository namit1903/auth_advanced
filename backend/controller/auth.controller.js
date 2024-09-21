import User from '../models/user.model.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import generateVerificationCode from '../utils/veficationCode.js'
import jwt from 'jsonwebtoken';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import {sendVerificationEmail,sendWelcomeEmail} from '../mailtrap/email.js'
export const signup=async(req,res)=>{
  try{
    const {username,email,password} = req.body;
    //check if exists
    if(!username || !email || !password){
      throw new Error('ALL FIELDS are required')
    }
    let user=await User.findOne({username});
    let mail=await User.findOne({ email});
    if(user || mail){
      return res.status(400).json({
        success:false,
        message:"USER already exists!!"})
    }
    //in case its a new signup
    const salt=await bcrypt.genSalt(10);//manually generating the salt
    const hashedPassword=await bcrypt.hash(password,salt);
    //const hashedPassword=await bcrypt.hash(password,10);
const verificationCode=generateVerificationCode(); 

    //put this in database
    const newUser=new User({username,email,password:hashedPassword,
      verificationCode,
      isVerified:false,//this is false untill the user verifies thier account
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
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
    const token=generateTokenAndSetCookie(res,newUser);
    
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
  return res.status(400).json({message:"invalid or expired code"})
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
 try{
  const{email,password}=req.body;
  const user=await User.findOne({email});
  if(!user) return res.status(404).json({message:"invalid email"});
  //compare the passwords
  const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch) return res.status(200).json({message:'Invalid password'});
//if everything is right
//genenrate JWT token
const token=jwt.sign({userId:user._id},'secrete key',{
  expiresIn:'1h'
});

 }catch(error){
  console/log("login error",error)
  res.status(500).json({message:"user not registered"});
 }

}

export const logout=(req,res)=>{
  //simply instruct the client to remove the token (on the frontend side)
  res.json({message:'Logout succesfull'})
};
