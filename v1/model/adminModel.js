const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {type:String, }|| Avdesh,
    email: {type:String,required:true},
    password: {type:String},
    role: {type:String,default:"Admin"},
    status: {type:String,default:"Active"},
    otp:{type:String,default:"0000"},
    token:{type:String},
    image:{type:String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);    