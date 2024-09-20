import jwt from 'jsonwebtoken '

function generateToken(user){
  const token=jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
  return token;
}
//set token as a cookie
const token = generateToken(user);
// res.cookie('jwt',token,{httpOnly:true,secure:true,maxAge:3600000})
//maxAge is 1 hr
// res.send('jwt token is set as cookie')