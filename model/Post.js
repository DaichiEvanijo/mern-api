const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
  author: {
    type:String,
    required: true,
  },
  title: {
    type:String,
    required: true,
  },
  body: {
    type:String,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now
    // Date.now will store the value as a MongoDB Date object (i.e., in BSON date format). MongoDB will be able to perform date-related queries, sorting, and indexing efficiently. (that's why using "new Date().toISOString()" here is not recommended) 
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reactions: {
    "like": { type: Number, default: 0 },
  },
  reactedUsers:{
    type:[String],
    default:[]
  },
});

module.exports = mongoose.model("Post", postSchema);