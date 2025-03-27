const express = require("express");
const router = express.Router();  
const Auth = require("../../common/Authentication");  

const userController = require('../controller/user');     

// router.post("/registerUser",userController.userRegister);
// router.post("/userLogin", userController.userLogin); 

// router.post("/forgotPassword",userController.forgetPassword);
// router.post("/serviceTypeAdd",userController.serviceCategory);

// router.post("/serviceTypeList",userController.serviceList);
module.exports=router;