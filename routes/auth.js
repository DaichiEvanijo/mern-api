const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

router.route("/")
.post(authController.handleLogin)

router.route("/forgetpassword")
  .post(authController.handleForgetPassword)

router.route("/resetpassword/:token")
  .post(authController.handleResetPassword)


module.exports = router