import express from "express";
const router=express.Router();
import { login, logout, signup } from "../controller/auth.controller.js";
import verifyToken from "../utils/verifyToken.js";
router.get('/signup',verifyToken,signup);//not callling middleware immediately
router.get('/login',login);
router.get('/logout',logout);


// module.exports=router;
export default router;//must be deafult
