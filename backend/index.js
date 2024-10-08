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
// app.options('*', cors()); // Enable preflight for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Correct origin without trailing slash
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
}));
app.use('/api/v1/auth',authRoutes);
app.get('/',(req,res)=>{
  console.log('namit')
  res.send("namit thaur")
})

app.listen(PORT,async()=>{
  await connectDB();
console.log("server is running at:",PORT);


})