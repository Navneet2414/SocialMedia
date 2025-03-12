const jwt = require("jsonwebtoken");
// const SECRET_KEY = process.env.JWT_SECRET || "Navneetyadav";
const SECRET_KEY = process.env.JWT_SECRET;
// const Model = require("../Model");
const USER = require("../v1/model/userModel");
const ADMIN = require("../v1/model/adminModel");
const functions = require("../common/commonFunction");
// const constants = require("../common/constants");
console.log("SecretKey", SECRET_KEY)
module.exports.getToken = (data) =>
    jwt.sign(data, SECRET_KEY, { expiresIn: "30 days" });

module.exports.verifyToken = (token) =>
    jwt.verify(token, SECRET_KEY);


const authToken = async (req, res, next) => {
    try {
        const token = String(req.headers.authorization || "")
            .replace(/bearer|jwt/i, "")
            .replace(/^\s+|\s+$/g, "");
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        // console.log(decoded, 'decoded')
        const user = await USER.findOne({ _id: decoded.id });
        // console.log(user, 'user')
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token verification failed" });
    }
}
const roleVerify = (roles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role; // Ensure user role is properly accessed
            // console.log(userRole, ' Rolessss,', roles);

            if (roles !== userRole) {
                return res.status(401).json({ message: "Permission denied" });
            }

            next(); // Proceed if the role is valid
        } catch (err) {
            // console.error(err, 'Error in roleVerify');
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
};

module.exports = { authToken, roleVerify }