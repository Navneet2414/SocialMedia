const emailService = require("../../common/emailService");

const User = require("../model/userModel");
const commonFunction = require("../../common/commonFunction");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "Navneetyadav";




module.exports.addAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            res.status(400).json({ message: "User Already Exist" });

        }


        const images = req.files ? req.files.map(file => file.filename) : [];
        const spassword = await commonFunction.securePassword(password);
        // console.log("filename",images.length);
        const data = await User.create({
            email: email,
            name: name,
            password: spassword,
            role: role,
            image: images,
        });
        res.status(200).json({ message: "Admin Added Successfully", data });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

module.exports.getAllList = async (req, res, next) => {
    try {
        const data = await User.find({});
        if (!data) {
            return res.status(400).json({ message: "User List Not Found" });
        }
        return res.status(200).json({ message: "All User List List", data });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

module.exports.updateDetails = async (req, res, next) => {
    try {
        const { email, name, } = req.body;
        const data = await User.findOneAndUpdate(
            { email: email },
            { $set: { name: name, email: email }, },
            { upsert: true, new: true }
        )
        if (data) {
            res.status(200).json({ message: `${data.role} data Updated Successfully`, data });
        } else {
            res.status(403).json({ message: "User Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: "internal server Error", error })
    }
}
