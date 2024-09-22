import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
  email:{
type:String,
required:true  
  },
  password:{
    type:String,
    required:true
  },
  lastLogin:{
    type:Date,
    default:Date.now
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  resetPasswordToken:String,
  resetPasswordExpiresAt:Date,
  verificationCode:String,
  verificationTokenExpiresAt:Date,

},{
  timestamps:true
})
const User=mongoose.model('User',userSchema);
export default User;