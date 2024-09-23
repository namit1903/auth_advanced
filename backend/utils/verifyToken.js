import 'dotenv/config'
import jwt from 'jsonwebtoken'
const verifyToken=(req,res,next)=>{
 
  const token=req.cookies.token;//"token" is the cookie name
  console.log("token verification",token)
  // console.log(process.env.JWT_SECRET);

  if(!token)
{
  return res.status(403).send('TOKEN NOT FOUND')
}
//agar token avalable hai to verify kro
try{
  const verified=jwt.verify(token,process.env.JWT_SECRET);
  console.log("verify token",verified)
  res.json({message:`Welcome user with ID:${verified.id}`,
    Details:verified
  })
//proceed to next milddleware /route handler
next();
}catch(e){
  console.log(e)
  res.status(401).json({error:e.message})
}
}
export default verifyToken;