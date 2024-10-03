const mongoose = require("mongoose")

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.DATABASE_URI,{})
    console.log("MongoDB connection successful")
  }catch(err){
    console.log(process.env.DATABASE_URI)
    console.error("MongoDB connection errror", err.message)
  }
}

module.exports = connectDB