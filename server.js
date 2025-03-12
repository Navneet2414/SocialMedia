const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connection = require("./common/connection");
const userRoute = require("./v1/route/userRoute");
const adminroute = require("./v1/route/adminRoute")
const superAdminroute = require("./v1/route/superAdminRoute");


app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   
    next();
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/api/admin",adminroute);
// app.use("/api/user",userRoute);
app.use("/api/superAdmin",superAdminroute);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
}); 