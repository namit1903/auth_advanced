import express from "express";
const router=express.Router();
import { login, logout,checkAuth, signup,verifyEmail,forgetPassword ,resetPassword} from "../controller/auth.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.get('/check-auth',verifyToken,checkAuth)
router.post('/signup',signup);//not callling middleware immediately
router.post('/login',login);
router.post('/forget-password',forgetPassword);
router.post('/reset-password/:id',resetPassword);
router.get('/logout',logout);
router.post('/verify-email',verifyEmail);


// module.exports=router;
export default router;//must be deafult
