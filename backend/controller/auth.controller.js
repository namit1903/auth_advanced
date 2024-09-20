import User from '../models/user.model.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import generateVerificationCode from '../utils/veficationCode.js'
import jwt from 'jsonwebtoken';
export const signup=async(req,res)=>{
  try{
    const {username,email,password} = req.body;
    //check is exists
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
    newUser=new User({username,email,password:hashedPassword,
      verificationCode,
      isVerified:false//this is false untill the user verifies thier account
    });
    await sendEmail(email, verificationCode);
   
    res.status(201).json({message:"User Registered successfully",
      verificationCode,
      verificationTokenExpiresAt:Date.now()+24*60*60*1000//24 hrs
    });
    await newUser.save();
    //jwt
    generateTokenAndSetCookie(res,user._id)
  }catch(e){
    console.log("signup gadbad",e);
    
    res.status(500).json({message:"SERVER EROOR",error:"error hai"});
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
