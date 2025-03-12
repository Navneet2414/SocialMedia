const express = require("express");
const router = express.Router();  
const Auth = require("../../common/Authentication"); 
const commonImage = require("../../common/commonFunction"); 
const adminController = require("../controller/admin");

const superAdminController = require('../controller/superAdmin');   

router.post("/loginSuperAdmin", adminController.adminLogin);
router.post("/addAdmin",Auth.authToken,Auth.roleVerify('superadmin'),commonImage. uploadImage.array('image'),superAdminController.addAdmin);
router.get("/getAllList",Auth.authToken,Auth.roleVerify('superadmin'),superAdminController.getAllList);
router.post("/updateDetails",Auth.authToken,Auth.roleVerify('superadmin'),superAdminController.updateDetails);

module.exports=router;