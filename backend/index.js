import express from "express";
import { connectDB } from "./db/connectDB.js";
import 'dotenv/config';
import authRoutes from './routes/auth.route.js'
const app=express();
const PORT=process.env.PORT ||5000;
//database se connection
//les create routes
app.use('/api/v1/auth',authRoutes);

app.listen(PORT,async()=>{
  await connectDB();
console.log("server is running at:",PORT);


})