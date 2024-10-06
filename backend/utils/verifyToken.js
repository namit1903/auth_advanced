import 'dotenv/config'
import jwt from 'jsonwebtoken'
const verifyToken=(req,res,next)=>{
 
  const token=req.cookies.token;//"token" is the cookie name
  console.log("token verification",token)
  // console.log(process.env.JWT_SECRET);

  if(!token)
{
  return res.status(403).json({message:'TOKEN NOT FOUND:unauthorized access',
    status:false
  })
}
//agar token avalable hai to verify kro
try{
  const verified=jwt.verify(token,process.env.JWT_SECRET);
  // console.log("verify token",verified)//this "verified " contains payload like _id,email
  console.log(verified)
  req.userId=verified.id
  console.log("userId",req.userId)
  console.log("userEmail",verified.email)
  //proceed to next milddleware /route handler
  next();
//////Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client: if below code is executed
  // res.json({message:`Welcome user with ID:${verified.id}`,
  //   Details:verified
  // })


}catch(e){
  console.log(e)
  res.status(401).json({error:e.message})
}
}
export default verifyToken;