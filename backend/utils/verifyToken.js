
const verifyToken=(req,res,next)=>{
  console.log("token verification")
  const token=req.cookies.jwt;
  if(!token)
{
  return res.status(403).send('TOKEN NOT FOUND')
}
//agar token avalable hai to verify kro
try{
  const verified=jwt.verify(token,process.env.JWT_TOKEN);
  res.json({message:`Welcome user with ID:${verified.id}`})
//proceed to next milddleware /route handler
next();
}catch(e){
  res.status(401).send('Invalid TOKEN')
}
}
export default verifyToken;