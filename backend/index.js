import express from "express";
import { connectDB } from "./db/connectDB.js";
import 'dotenv/config';
import authRoutes from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from 'cors'
const app=express();
const PORT=process.env.PORT ||5000;
//database se connection
app.use(cookieParser());

app.use(bodyParser.json());
//les create routes
app.use(cors());
app.use('/api/v1/auth',authRoutes);
app.get('/',(req,res)=>{
  console.log('namit')
  res.send("namit thaur")
})

app.listen(PORT,async()=>{
  await connectDB();
console.log("server is running at:",PORT);


})