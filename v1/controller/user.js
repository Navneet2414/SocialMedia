

const express = require('express');
const router = express.Router();

const commonFunction = require("../../common/commonFunction");
const emailService = require("../../common/emailService");
const serviceTypeModel = require("../model/serviceTypeModel");



const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "Navneetyadav";
 





module.exports.userRegister = async (req, res, next) => {
    const { name, email, password,  } = req.body;
    const spassword = await commonFunction.securePassword(password);

    try {
        const data = await User.create({
            name: name,
            email: email,
            password: spassword,
           
        })
        console.log("=======UserRegistered Successfully======", data)
        res.send({ message: "User registered successfully", data });

    } catch (error) {
        console.log("=====Erorr i n user register", error);
        res.send({ message: "User registered failed", error });
    }

}


module.exports.serviceCategory = async (req, res, next) => {
   const {userId,service,description,name} = req.body;
    try {
       const data = await serviceTypeModel.create({
        userId:userId,
        service:service,
        description:description,
        name:name

       })
       if(!data){
         res.status(400).json({message:"Service not created"});
       }
       res.status(200).json({message:"Service created successfully",data});
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

// module.exports.serviceList = async (req, res, next) => {
//     try {
//         const data = await serviceTypeModel.findOne({userId:req.body.userId})
//         .populate(
//           "userId" ,
//            "name",
//       ).exec();
//         if(!data){
//            return res.status(400).json({message:"Service not found"});
//         }
//          return res.status(200).json({message:"Service found successfully",data});
        
//     } catch (error) {
//         console.log("error", error);
//         res.status(500).json({ message: "Internal Server Error", error });
//     } 
// }


// module.exports.userLogin = async (req, res) => {
//     const { email, password } = req.body;
//     // console.log("=======>>>", req.body);
//     const now = new Date();
//     try {
//         const data = await User.findOne({ email: email, role:"user" });
//         // return console.log("data====>>>", data);
//         // return console.log("data====>>>", password);
//         if (!data) {
//             return res.json({ message: "Invalid credentials" });
//         }
//         const verifypassword = await bcrypt.compare(password, data.password);

//         if (!data) {
//             return res.json({ message: "Invalid credentials" });
//         }
//         if (!verifypassword) {
//             console.log(data.count, "======== ccc")
//             const count = await User.findOneAndUpdate(
//                 { email: email },
//                 { $set: { count: data.count + 1 } },
//                 { upsert: true, new: true },
//             )
//             if(data.isBlocked == true && data.blockUntil) {
//                 console.log("======11111", data.isBlocked, data.blockUntil);
//                 if (now > data.blockUntil) {
//                     console.log("========in unblock part ==")
//                     // Unblock the user
//                     await User.findOneAndUpdate(
//                         { email: email },
//                         { $set: { isBlocked: false, count: 0, blockUntil: null } },
//                         { new: true }
//                     );
//                     console.log("User unblocked automatically:", email);


//                 } else {
//                     return res.status(403).json({ message: "Your account is blocked. Try again later after:", doc: data.blockUntil });
//                 }
//             }
//             if (data.count > 3) {
//                 const blockUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
//                 const result = await User.findOneAndUpdate(
//                     { email: email },
//                     { $set: { blockUntil: blockUntil, isBlocked: true, } },
//                     { upsert: true, new: true },
//                 )

//                 const adminDetail = await User.findOne({ email: "nyadav1243@gmail.com" })
//                 if(adminDetail.role == "superadmin") {
//                     try{
//                         // console.log("emailSuper",adminDetail.email);
//                     await emailService.emailService({
//                         to: adminDetail.email,
//                         subject: `${result.role} ${result.name} has been blocked`,
//                         message: `<h3> For entering multiple wrong Password email : ${result.email} is blocked for 5 minutes.</h3>`,
//                     });
//                     return res.status(200).json({message:`Email sent ${result.name} You Entered  wrong Password Multiple time `});
//                 }catch(error){
//                     console.error('Failed to send email:', error);
//                      return res.status(500).json({ message: 'Failed to send email', error });
//                 }
//                 }
//                 return res.status(403).json({ message: "Too many failed attempts. Contact with Super Admin Sir.", doc: {time:data.blockUntil,admin:adminDetail.name} });

//             }
//             return res.json({ message: "Invalid credentials pw", doc: data.count })

//         }



//         const token = jwt.sign(
//             { id: data._id, email: data.email },
//             SECRET_KEY,
//             { expiresIn: "1h" }
//         );
//         const result = await User.findOneAndUpdate(
//             { email: email },
//             {
//                 $set: {
//                     token: token,
//                     count: 0,
//                     isBlocked: false,
//                     blockUntil: null
//                 }
//             },
//             { upsert: true, new: true },
//         )
//         // console.log("token",result)
//         const doc = await result.save();
//         console.log("admin token", doc)
//         // const newdata = await User.findOne({ email: email, });
//         res.send({ message: "User Login Successfully", doc });

//     } catch (error) {
//         // res.send({ message: "Admin Login Failed", error });
//         console.log("errror", error);
//         res.status(500).json({ message: "Internal Server Error", error })
//     }
// }






