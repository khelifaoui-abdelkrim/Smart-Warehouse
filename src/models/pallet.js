const mongoose = require('mongoose');


const palletShema = new mongoose.Schema({
    //palette_id
    palette_id: { type: String, required: true, unique: true},
    //location
    location: { type: String,enum:['A','B','C'] , required : true},
    //model
    model: { type: String,enum:['A','B','C','D','E'] , required : true}, //'0.5M','1M','1.5M','1G','0.33G'
    //lot
    lot: { type: String, required : true},
    //status
    current_status: {type : String ,enum: ['Q', 'QR', 'V', 'R'], default: 'Q'},
    //fabrication date
    fabrication: { type: Date, default : Date.now() },
    //expiration date
    expiration: { type: Date, required : true },
    //last scan
    last_scan: { type: Date,default : Date.now() },
    //soft delete flag
    deleted: {type : Boolean , default : false}
},
{ versionKey: false }//  This removes __v)
); 

module.exports = mongoose.models.Pallet || mongoose.model('Pallet', palletShema); 
// const mongoose = require('mongoose');

// const palletShema = new mongoose.Schema({
//     //palette_id
//     palette_id: { type: String, required: true, unique: true ,index : true},
//     //location
//     location: { type: String,enum:['AA','BB','CC'] , required : true},
//     //status
//     current_status: {type : String ,enum: ['in stock', 'waiting for test', 'validated', 'rejected'], default: 'in stock'},
//     //last scan
//     last_scan: { type: Date,default : Date.now() },
//     //soft delete flag
//     deleted: {type : Boolean , default : false}
// },
// { versionKey: false }//  This removes __v)
// ); 
// module.exports = mongoose.models.Pallet || mongoose.model('Pallet', palletShema);