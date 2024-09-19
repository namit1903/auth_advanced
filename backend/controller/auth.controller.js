import User from '../models/user.model.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js';

import jwt from 'jsonwebtoken';
export const signup=async(req,res)=>{
  try{
    const {username,email,password} = req.body;
    //check is exists
    let user=await User.findOne({username});
    let mail=await User.findOne({email: email});
    if(user || mail){
      return res.status(400).json({message:"USER already exists!!"})
    }
    //in case its new signup
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    //put this in database
    user=new User({username,email,password:hashedPassword});
    await user.save();
    res.status(201).json({message:"User Registered successfully"});

  }catch(e){
    console.log("signup gadbad",e);
    
    res.status.send("SIGN UP AGAIN").json({message:"SERVER EROOR"});
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
