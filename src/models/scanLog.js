const mongoose = require('mongoose');

const ScanLogShema = new  mongoose.Schema({
    palette : {type : mongoose.Schema.Types.ObjectId, ref: "Pallet" ,required : true},
    user : {type : mongoose.Schema.Types.ObjectId, ref: "User" ,required : true},
    location: { type: String, enum: ['A', 'B', 'C'], required: true },
    action: { type: String, enum: ['check-in', 'check-out', 'validate', 'reject'], required: true },
    timestamp: { type: Date , default : Date.now()}
},{ versionKey: false })

module.exports = mongoose.model('ScanLog',ScanLogShema)