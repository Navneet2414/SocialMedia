

const express = require('express');
const router = express.Router();
var multer = require('multer');
const path = require('path');

const commonFunction = require("../../common/commonFunction");
const emailService = require("../../common/emailService");


const Admin = require('../model/adminModel');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "Navneetyadav";




module.exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    // console.log("=======>>>", req.body);
    const now = new Date();
    try {
        const data = await User.findOne({ email: email, });
        // console.log("Role====>>>", data.role)
        // console.log("Role====>>>", data.isBlocked);
        const verifypassword = await bcrypt.compare(password, data.password);
        if (!data ) {
            return res.json({ message: "Invalid credentials" });
        }
        if(data.isBlocked == true ) {
            return res.status(403).json({message:"Your Id Is Blocked contact with Superadmin"})
            
        }
        if (data.role === "superadmin") {
            if (!verifypassword) {
                return res.json({ message: "Invalid credentials" });
            }

        }
        if (!verifypassword) {
            console.log(data.count, "======== ccc")
            const count = await User.findOneAndUpdate(
                { email: email },
                { $set: { count: data.count + 1 } },
                { upsert: true, new: true },
            )
            
            if (data.count > 3) {
                // const blockUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
                const result = await User.findOneAndUpdate(
                    { email: email },
                    { $set: { isBlocked: true, } },
                    { upsert: true, new: true },
                )

                const adminDetail = await User.findOne({ email: "nyadav1243@gmail.com" })
                if (adminDetail.role == "superadmin") {
                    try {
                        // console.log("emailSuper",adminDetail.email);
                        await emailService.emailService({
                            to: adminDetail.email,
                            subject: `${result.role} ${result.name} has been blocked`,
                            message: `<h3> For entering multiple wrong Password ${result.name} email : ${result.email} is blocked.</h3>`,
                        });
                        return res.status(200).json({ message: ` ${result.name} You are blocked Contact with SuperAdmin Sir.` });
                    } catch (error) {
                        console.error('Failed to send email:', error);
                        return res.status(500).json({ message: 'Failed to send email', error });
                    }
                }
                return res.status(403).json({ message: "Too many failed attempts. Contact with Super Admin Sir.", doc: adminDetail.name });

            }
            return res.json({ message: "Invalid credentials pw", doc: data.count })

        }



        const token = jwt.sign(
            { id: data._id, email: data.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        const result = await User.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    token: token,
                    count: 0,
                    isBlocked: false,

                }
            },
            { upsert: true, new: true },
        )
        // console.log("token",result)
        const doc = await result.save();
        console.log("admin token", doc)
        // const newdata = await User.findOne({ email: email, });
        res.send({ message: `${result.role}  Login Successfully`, doc });

    } catch (error) {
        // res.send({ message: "Admin Login Failed", error });
        console.log("errror", error);
        res.status(500).json({ message: "Internal Server Error", error })
    }
}
module.exports.forgetPassword = async (req, res,) => {
    const { email, } = req.body;
    try {
        const data = await Admin.findOne({ email: email });
        if (!data) {
            console.log("Invalid UserId");
            res.status(400).json({ message: "Invalid UserId" })
        }
        if (data) {
            const OTP = Math.floor(1000 + Math.random() * 9000);
            try {
                await emailService.emailService({
                    to: email,
                    subject: 'Forgot password',
                    message: `Your OTP: ${OTP}`,
                });
            } catch (error) {
                console.error('Failed to send email:', error);
                return res.status(500).json("Failed to send email.");
            }
            const result = await User.findOneAndUpdate(
                { email: email },
                { $set: { otp: OTP } },
                { upsert: true, new: true },

            )
            let doc = await result.save();
            // console.log("otp send Successfully",doc);
            res.status(200).json({ message: "otp send Successfully", doc });
        } else {
            console.log("some problem with email service ")
            res.status(400).json({ message: "some data error" })
        }


    } catch (error) {
        console.log("errror", error);
        res.status(500).json({ message: "Internal Server Error", error })

    }
}

module.exports.verifyOtp = async (req, res) => {
    const { otp, } = req.body;

    try {
        const data = await User.findOne({ otp: otp });
        if (data) {
            console.log("otp verified successfully====>>>", otp)
            res.status(200).json({ message: "Otp verified Successfully", data })
        }
        console.log("invalid Otp")
        res.status(400).json({ message: "Invalid otp " })

    } catch (error) {
        console.log("errror", error);
        res.status(500).json({ message: "Internal Server Error", error })

    }
}
module.exports.updatePassword = async (req, res, next) => {
    try {
        const { password, otp } = req.body;
        const spassword = await commonFunction.securePassword(password);
        const data = await User.findOneAndUpdate(
            { otp: otp },
            { $set: { password: spassword } },
            { upsert: true, new: true }
        )
        if (data) {
            const doc = await data.save()
            console.log("Password Update successfully", doc);
            res.status(200).json({ message: "Password Updated Successfully", doc })
        } else {
            console.log("Password not updated Successfully");
            res.status(400).json({ message: "Password Not updated " })
        }
    } catch (error) {
        console.log("errror", error);
        res.status(500).json({ message: "Internal Server Error", error })

    }
}

module.exports.getUserList = async (req, res) => {
    try {
        const data = await User.find({});
        if (data) {
            console.log("User List", data);
            res.status(200).json({ message: "User List", data })
        } else {
            console.log("User List not found");
            res.status(400).json({ message: "User List not found" })
        }
    } catch (error) {
        console.log("errror", error);
        res.status(500).json({ message: "Internal Server Error", error })
    }
}

module.exports.uploadSingleImage = async (req, res) => {

    try {
        const file = req.file;
        const allquery = await User.create({
            name: req.body.name,
            img: file.filename
        });

        res.status(200).json({ 'statusCode': 200, 'status': true, message: 'Image added', data: allquery });

    } catch (error) {
        console.log("errror", error);
        res.status(500).json({ message: "Internal Server Error", error })
    }
}