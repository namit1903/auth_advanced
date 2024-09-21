import jwt from 'jsonwebtoken';

function generateTokenAndSetCookie(res,user){

  const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
  res.cookie('jwt',token,{httpOnly:true,secure:process.env.NODE_ENV=='production',maxAge:3600000})
//maxAge is 1 hr
// res.send('jwt token is set as cookie')
res.status(200).json({
  success:true,
  message: 'token is set as cookie',
  user:{
    ...user._doc,
    password:undefined
  }
})
 return token;
}
export default generateTokenAndSetCookie;
