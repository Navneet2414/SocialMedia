const express = require("express");
const router = express.Router();    
const Auth = require("../../common/Authentication");
const commonImage = require("../../common/commonFunction");


const adminController = require('../controller/admin');     

// router.post("/registerAdmin",adminController.register);
router.post("/adminLogin", adminController.adminLogin); 
router.post("/forgotPassword",adminController.forgetPassword);
router.post("/verifyOtp",adminController.verifyOtp);
router.post("/updatePassword",adminController.updatePassword);
// router.post("/getUserList",Auth.verify("admin"),adminController.getUserList);
router.post("/getUserList",Auth.authToken,Auth.roleVerify('admin'),adminController.getUserList);
router.post("/uploadImage",Auth.authToken,Auth.roleVerify('superadmin'),commonImage. uploadImage.single('image'),adminController.uploadSingleImage);
router.post("/logout",adminController.logout)
module.exports = router;