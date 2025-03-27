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
        // const newUser = await data.email;
        // if (newUser) {
        //     try {
        await emailService.emailService({
            to: data.email,
            subject: `${data.name} You added as ${data.role} Successfully at our organisation`,
            message: `<h3> Your Login credential is email: ${data.email} and password: ${password}.<br/>Login url: http://localhost:3000</h3>`,

        });


        //     } catch (error) {
        //         res.status.json({ message: "Internal Server Error", error })
        //     }
        // }
        return res.status(200).json({ message: "Admin Added Successfully", data });
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
        const { email, name, role, _id } = req.body;

        const data = await User.findOneAndUpdate(
            { email: email },
            // {_id:_id},
            { $set: { name: name, email: email, role: role, }, },
            { upsert: true, new: true }
        )
        if (data) {
            res.status(200).json({ message: `${data.role} data Updated Successfully`, data });
        } else {
            res.status(403).json({ message: "User Not Found" });
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "internal server Error", error });
    }
}

// ##################Filter List Based on Role #####################################

module.exports.filterRoleList = async (req, res, next) => {
    try {
        const { role, status, dateStart,endDate, lastLoginDate } = req.body;


        console.log("Received request body:", req.body);

        if (!dateStart || !endDate) {
            return res.status(400).json({ message: "Date is required in 'd/M/yyyy' format" });
        }


        const [startDay, startMonth, startYear] = dateStart.split("/");
        const [endDay, endMonth, endYear] = endDate.split("/");

        if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) {
            return res.status(400).json({ message: "Invalid date format. Use 'd/M/yyyy'" });
        }

        const formattedStartDate = `${startYear}-${startMonth.padStart(2, "0")}-${startDay.padStart(2, "0")}`;
        const formattedEndDate = `${endYear}-${endMonth.padStart(2, "0")}-${endDay.padStart(2, "0")}`;

        // Define start and end of the selected range
        const startOfDay = new Date(`${formattedStartDate}T00:00:00.000Z`);
        const endOfDay = new Date(`${formattedEndDate}T23:59:59.999Z`);

        // MongoDB Aggregate Query
        const data = await User.aggregate([
            {
                $match: {
                    role: role,
                    status: status,
                    createdAt: { $gte: startOfDay,$lte: endOfDay }
                }
            }
        ]);

        if (data.length === 0) {
            return res.status(400).json({ message: "User List Not Found" });
        }

        return res.status(200).json({ message: "User List", data });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

// ############################Enable User######################################

module.exports.disableAccount = async(req,res,next)=>{
try{
    const {email,} = req.body;
    const data = await User.findOneAndUpdate(
        {email:email},
        {$set:{status:"InActive",isBlocked:true},},
        {new:true}
    )

if(data){
      try {
                    await emailService.emailService({
                        to: data.email,
                        subject: 'Your Id is Blocked ',
                        message: `Your Id ${data.email} is Blocked by SuperAdmin contact with SuperAdmin`,
                    });
                } catch (error) {
                    console.error('Failed to send email:', error);
                    return res.status(500).json("Failed to send email.");
                }
    res.status(200).json({message:`${data.role} Account Disabled Successfully`})
}else{
    res.status(403).json({message:"User Not Found"})
}
}catch(error){
    res.status(500).json({message:"Internal Server Error",error})
}
}

// ######################Enable User #######################################

module.exports.enableAccount = async(req,res,next)=>{
    console.log("##############in Enable Userapi##################")
    try{
        const {email,} = req.body;
        const data = await User.findOneAndUpdate(   
            {email:email},
            {$set:{status:"Active",isBlocked:false},},
            {new:true}
        )
    
    if(data){
          try {
                await emailService.emailService({
                     to: data.email,
                     subject: 'Your Id is UnBlocked ',
                     message: `Your Id ${data.email} is UnBlocked by SuperAdmin  You Now able to Login`,
                        }); 
                    } catch (error) {
                        console.error('Failed to send email:', error);
                        return res.status(500).json("Failed to send email.");
                    }
        res.status(200).json({message:`${data.role} Account Enabled Successfully`})
    }else{
        res.status(403).json({message:"User Not Found"})
    }
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error})
    }
    }
