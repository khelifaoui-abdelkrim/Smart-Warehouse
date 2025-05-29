const mongoose = require('mongoose');
const Order = require('../models/order');



const orderShema = new mongoose.Schema({

    //order id
    order_id: { type: String, required : true , unique : true},
    //client
    client: { type: String, enum:['client1','client2','client3'] , required : true},
    //created by
    createdBy : { type: String,required : true},
    //created at
    createdAt : { type: Date, default : Date.now()},
    //created at
    shippedAt : { type: Date },
    //quai
    dock: { type: String,enum:['1','2','3','4','5'] , required : true, default : "1"}, //'0.5M','1M','1.5M','1G','0.33G'
    //product(s)
    products : [
        {   
            //model
            model: { type: String,enum:['A','B','C','D','E'] , required : true}, //'0.5M','1M','1.5M','1G','0.33G'
            //palettes quantity
            quantity : { type: String, required : true},
            // List of assigned pallet IDs (added only after validation)
            assignedPallets :{ type : [String]}
        }
    ],
    //status
    status: {type: String, enum: ['Pending', 'Shipped', 'Canceled'], default: 'Pending'},
},
{versionKey : false}
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderShema);
