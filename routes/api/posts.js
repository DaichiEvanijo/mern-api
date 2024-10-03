const express = require("express")
const router = express.Router()
const postsController = require("../../controllers/postsController")

const ROLES_LIST = require("../../config/roles_list")
const verifyJWT = require("../../middleware/verifyJWT")
const verifyRoles = require("../../middleware/verifyRoles")

router.route("/")
  .get(postsController.getAllPosts)  
  .post(verifyJWT,verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), postsController.createPost);  

router.route("/:id")
  // .get(postsController.getPostById)  
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), postsController.updatePost) 
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), postsController.deletePost);  

router.route("/reaction")
  .post(verifyJWT, postsController.addReaction); 


module.exports = router


// https://chatgpt.com/share/66f5bd1d-cd98-8007-8f7e-2c9e44b28437