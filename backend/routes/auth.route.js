import express from "express";
const router=express.Router();
import { login, logout, signup } from "../controller/auth.controller.js";
import verifyToken from "../utils/verifyToken.js";
router.post('/signup',signup);//not callling middleware immediately
router.post('/login',verifyToken,login);
router.post('/logout',verifyToken,logout);


// module.exports=router;
export default router;//must be deafult
