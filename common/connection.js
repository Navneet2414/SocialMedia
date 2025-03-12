const mongoose = require('mongoose');
const bcrypt = require('bcrypt');var jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "Navneetyadav";
const salt = 10;
const Admin = require('../v1/model/userModel');

// const url = process.env.MONGO_URL;
const url = "mongodb://localhost:27017/socialMedia";

mongoose.connect(url,{ autoIndex: false })
    .then(async () => {
        console.log("MongoDB Connected");

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ role: "superadmin" });
      
        if (!existingAdmin) {
          console.log("No superadmin found. Creating one...");
      
          // Create a new admin user
          const hashedPassword = await bcrypt.hash("admin123", 10);
          const superAdmin = new Admin({
            name: "SuperAdmin",
            // email: "admin@example.com",
            email: "nyadav1243@gmail.com",
            password: hashedPassword,
            role: "superadmin",
            otp:""
          });
      
          await superAdmin.save();
          console.log("SuperAdmin user created successfully!");
        } else {
          console.log("SuperAdmin already exists. Skipping creation.");
        }
      }).catch(err => console.log("DB Connection Error:", err));