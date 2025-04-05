const mongoose = require('mongoose');

const ScanLogShema = mongoose.Schema({
    palette : {type : mongoose.Schema.Types.ObjectId, ref: "pallet" ,required : true},
    user : {type : mongoose.Schema.Types.ObjectId, ref: "user" ,required : true},
    location: { type: String, enum: ['AA', 'BB', 'CC'], required: true },
    action: { type: String, enum: ['check-in', 'check-out', 'validate', 'reject'], required: true },
    timestamp: { type: Date , default : Date.now()}
},{ versionKey: false })

module.exports = mongoose.model("ScanLog",ScanLogShema)