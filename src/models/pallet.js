const mongoose = require('mongoose');

const palletShema = new mongoose.Schema({
    //rfid
    rfid: { type: String, required: true, unique: true ,index : true},
    //location
    location: { type: String,enum:['AA','BB','CC'] , required : true},
    //status
    current_status: {type : String ,enum: ['in stock', 'waiting for test', 'validated', 'rejected'], default: 'in stock'},
    //last scan
    last_scan: { type: Date,default : Date.now() },
    //soft delete flag
    deleted: {type : Boolean , default : false}
},
{ versionKey: false }//  This removes __v)
); 
module.exports = mongoose.models.Pallet || mongoose.model('Pallet', palletShema);
