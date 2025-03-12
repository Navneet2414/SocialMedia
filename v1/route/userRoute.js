const express = require("express");
const router = express.Router();  
const Auth = require("../../common/Authentication");  

const userController = require('../controller/user');     

// router.post("/registerUser",userController.userRegister);
// router.post("/userLogin", userController.userLogin); 

// router.post("/forgotPassword",userController.forgetPassword);

module.exports=router;