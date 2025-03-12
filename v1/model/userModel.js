const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("../model/userModel");

const userSchema = new Schema({
    userId:{ type: Number, unique: true },
    name: {type:String, required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,},
    image: {type:[String],default:"iiiiii"},
    role: {type:String,default:"user"},
    status: {type:String,default:"Active"},
    otp:{type:String,},
    token:{type:String},
    count:{type:Number,default:0},
    isBlocked:{type:Boolean,default:false},
    blockUntil:{type:Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
} );

// userSchema.pre('save', async function (next) {
//     if (!this.userId) {
//         const counter = await User.findByIdAndUpdate(
//             { _id: 'userId' }, // Identifier for the counter
//             { $inc: { seq: 1 } }, // Increment the sequence
//             { new: true, upsert: true } // Create if not exists
//         );
//         this.userId = counter.seq;
//     }
//     next();
// });

module.exports = mongoose.model('User', userSchema);    