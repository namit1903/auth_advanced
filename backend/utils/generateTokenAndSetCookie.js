import jwt from 'jsonwebtoken';
// in asyn programming callback is a function passed to another function and is executed anly when the function has completed its task
async function  generateTokenAndSetCookie(res,user){

  const token=  jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
  res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV=='production',maxAge:3600000})
//maxAge is 1 hr
// res.send('jwt token is set as cookie')
console.log('token is set as cookie:',token);
res.status(200).json({
  success:true,
  message: 'jwt token is set as cookie',
  user:{
    ...user._doc,
    password:undefined
  }
})

}
export default generateTokenAndSetCookie;
