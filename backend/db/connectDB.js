import mongoose from "mongoose";

export const connectDB=async()=>{
  try{
 const conn= await mongoose.connect(process.env.MONGO_URL);
 console.log("mongo db connected:");
//  console.log("mongo db connected:",conn);
}
  catch(error){
    console.log("error hua beata DB me",error)
    process.exit(1);
  }
}