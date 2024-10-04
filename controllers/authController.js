const User = require("../model/User")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const handleLogin = async(req, res) => {
  const {user, pwd} = req.body
  if(!user || !pwd) return res.status(400).json({message:"Usename and password are required"})  
  const foundUser = await User.findOne({username:user.trim()}).exec()
  if(!foundUser) return res.status(401).json({message:"Username or password is wrong.\n Or you still didn't register"}) //unauthorized
  const match = await bcrypt.compare(pwd, foundUser.password)

  if(match){
    const roles = Object.values(foundUser.roles)
    const accessToken = jwt.sign(
      {"UserInfo":{
        "username":foundUser.username,    
        "roles":roles
      }},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:"10s"}
    );
    const refreshToken = jwt.sign(
      {"username":foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn:"1d"}
    );
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log(`logined and the user info is now \n${result}`)
    res.cookie("jwt",refreshToken, {httpOnly:true, secure: true, sameSite: 'Strict',   maxAge:24*60*60*1000})
    // res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    //secure:trueはthunder clientでテストするためには消さないといけないがproductionのためには必要
    res.json({accessToken, roles})

  }else{
    res.sendStatus(401)
  }
}


const handleForgetPassword = async(req, res) => {
  const {username, email} = req.body
  console.log(`${username} ${email}`)
  if(!email || !username) return res.status(400).json({message:"Email is required"})
  const foundUser = await User.findOne({username:username.trim()}).exec()
  if(!foundUser) return res.status(401).json({message:"user not found"})
  const token = crypto.randomBytes(32).toString("hex")
  foundUser.resetToken = token
  foundUser.tokenExpiration = Date.now() + 3600000 //1hour
  await foundUser.save()
  console.log(`generated resetToken: ${token}`);
  

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS,
    }
  })
  const mailOptions ={
    from:process.env.EMAIL_USER,
    to:email,
    subject:"Password reset request", 
    text:`You requested a password reset. Please click the following link to reset your password: \n\n
    http://localhost:5173/resetpassword/${token}/`
  }
  // https://amazing-kleicha-0fe9bd.netlify.app/resetpassword/${token}

  
  transporter.sendMail(mailOptions, (err, info)=> {
    if(err){
      console.log(`email sending fails \n ${err}`)
      return res.status(500).json({message:"Error on sending mail"})
    }
    res.status(200).json({message:`Password reset link sent to ${email} !`})
  })
}

const handleResetPassword = async(req, res) => {
  const {password} = req.body
  const {token} = req.params
  console.log(`accpeted resetToken: ${token}`);
  console.log(`${password} ${token}`)
  if(!token|| !password) return res.status(400).json({message:"password and token are required"})
  const foundUser = await User.findOne({resetToken:token, tokenExpiration:{ $gt: Date.now() }}).exec()
  // $gt: greater than
  if(!foundUser) return res.status(400).json({message:"invalid or expired token was sent"})

  const hashedPassword = await bcrypt.hash(password, 10)
  foundUser.password = hashedPassword
  foundUser.resetToken = undefined
  foundUser.tokenExpiration = undefined
  await foundUser.save()

  res.status(200).json({message:"Password has been reset"})
}



module.exports = {handleLogin, handleForgetPassword, handleResetPassword}