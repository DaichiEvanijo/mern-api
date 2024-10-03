const User = require("../model/User")
const bcrypt = require("bcrypt")

const handleNewUser = async (req, res) => {
  const {user, pwd} = req.body
  if(!user || !pwd) return res.status(400).json({message:"Username and password are required"})
  const duplicate = await User.findOne({username:user}).exec()
  if(duplicate) return res.status(409).json({message:"Same username is taken.\n Please consider a different username"}) // duplicate
  try{
    const hashedPwd = await bcrypt.hash(pwd, 10)
    const result = await User.create({
      "username":user.trim(), 
      "password":hashedPwd.trim()
    })
    res.status(201).json({message:`New user ${user} created !`})
    console.log(`Registration was done with \n ${result}`)
  }catch(err){
    res.status(500).json({message:err.message})
  }
}

module.exports = {handleNewUser}
