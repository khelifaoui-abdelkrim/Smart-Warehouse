const mongoose = require('mongoose');

const palletShema = new mongoose.Schema({
    rfid: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Produced', 'Stored', 'Validated', 'Loaded'], default: 'Produced' },
    location: { type: String, default: 'Production Line' },
    timestamps: [{ event: String, time: Date }]
},{ versionKey: false }//  This removes __v)
); 
module.exports = mongoose.model('Pallet',palletShema);