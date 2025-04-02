const mongoose = require('mongoose');

const palletShema = new mongoose.Schema({
    //rfid
    rfid: { type: String, required: true, unique: true ,index : true},
    //status
    status: {type : String ,enum: ['in stock', 'waiting for test', 'validated', 'rejected'], default: 'in stock'},
    //operator
    operator: { type: String,enum:['AA','BB','CC'] , required : true},
    //last scan
    timestamp: { type: Date,default : Date.now() }
},
{ versionKey: false }//  This removes __v)
); 
module.exports = mongoose.model('Pallet',palletShema);