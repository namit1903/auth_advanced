import express from "express";
import { connectDB } from "./db/connectDB.js";
import 'dotenv/config'
const app=express();
const PORT=8000;
//database se connection
//les create routes
app.use('/api/v1/auth',authRoutes)

app.listen(PORT,async()=>{
  await connectDB();
console.log("server is running at:",PORT);


})