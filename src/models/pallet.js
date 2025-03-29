const mongoose = require('mongoose');

const palletShema = new mongoose.Schema({
    //tfid
    rfid: { type: String, required: true, unique: true ,index : true},

    //location
    location: { type: String,enum:['AA','BB','CC'] },

    //timestamps
    timestamps: [{
        status: {type : String ,enum: ['in stock', 'waiting for test', 'validated', 'rejected'], default: 'in stock'}, 
        time: { type: Date, default: Date.now },
    }],

    //soft delete flag
    deleted: {type : Boolean , default : false}
},{ versionKey: false }//  This removes __v)
); 
module.exports = mongoose.model('Pallet',palletShema);