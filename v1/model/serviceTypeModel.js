const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
    userId:mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String,  },
    service: { type: String, required: true },
    status: { type: String, default: "Active" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ServiceType", serviceTypeSchema);