const Post = require("../model/Post")

const getAllPosts = async (req, res) => {
  const posts = await Post.find()
  if(!posts) return res.status(204).json({"message":"no employee to display"})
  res.json(posts)
}


const createPost = async (req, res) => {
  const {author, title, body} = req.body
  // このコメントの行にauthorがloginしたときのusernameと一致しているかどうかを確認するコードを書くべきか否か
  if(!author || !title || !body){
    return res.status(400).json({"message":"author, title, body are required"})
  }
  try{
    const result = await Post.create({
      author,
      title, 
      body
    })
    res.status(201).json(result)
    console.log(`new post is created\n${result}`)
  }catch(err){
    console.err(err)
  }
}



const updatePost = async (req, res) => {
  const {_id, title, body} = req.body 
  if(!_id) return res.status(400).json({"message":"_id is required"})
  const post = await Post.findOne({_id:_id}).exec()
  if(!post){
    return res.status(204).json({"message":`no post matches _id ${_id}`
    })
  }
  if(title) post.title = title
  if(body) post.body = body
  post.date = new Date().toISOString()
  const result = await post.save()
  res.json(result)
} 

const deletePost = async (req, res) => {
  const {id} = req.params
  console.log(id)
  if(!id) return res.status(400).json({"message":"post _id required"})
  const post = await Post.findOne({_id:id}).exec()
  if(!post){
    return res.status(404).json({"message":`no post matches _id ${_id}`})
  }
  const result = await post.deleteOne({_id:id})
  res.json(result)
  console.log(`${result}\n deleted`)
}

// const getPostById = async (req, res) => {
//   const {id} = req.params
//   console.log(req.params)
//   if(!id) return res.status(400).json({"message":"post _id required"})
//   const post = await Post.findOne({_id:id}).exec()
//   if(!post){
//     return res.status(404).json({"message":`no post matches _id ${id}`})
//   }
//   res.json(post)
// }

const addReaction = async (req, res) => {
  const { _id } = req.body;
  const username = req.user

  if (!_id) {
      return res.status(400).json({ "message": "_id and reaction are required" });
  }
  try {
      const post = await Post.findOne({ _id }).exec();
      if (!post) {
          return res.status(404).json({ "message": `No post matches _id ${_id}` });
      }

      if(!post.reactedUsers.includes(req.user)){
        post.reactions.like = post.reactions.like + 1;
        post.reactedUsers.push(username)
      }else{
        post.reactions.like = post.reactions.like -1;
        post.reactedUsers = post.reactedUsers.filter(user => user !== username)
      }

      const result = await post.save();

      res.json(result);
  } catch (err) {
      console.error(err);
      res.status(500).json({ "message": "An error occurred while adding reaction" });
  }
}

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  // getPostById,
  addReaction,
}