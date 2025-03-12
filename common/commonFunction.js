
const bcrypt = require('bcrypt');
const fs = require('fs');
var multer  = require('multer');
const path = require('path');
function generateOTP(length = 6) {
    const crypto = require("crypto");
    let otp = "";
    const digits = "0123456789";

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

// console.log(generateOTP()); // Example Output: 472910
module.exports.securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        // console.log(passwordHash);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};




const uploadDir = 'uploads/';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Multer Storage Configuration
const multerStorage = multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, uploadDir); // Set your desired upload directory
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `image-${Date.now()}.${ext}`);
    }
  });
  
  // Multer File Filter
  const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
      return cb(new Error('Please upload an image (PNG or JPG only)'));
    }
    cb(null, true);
  };
  
  // Image Upload Middleware
  const uploadImage = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });
  module.exports.uploadImage = uploadImage;