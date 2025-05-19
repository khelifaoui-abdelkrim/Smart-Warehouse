const mongoose = require('mongoose');

const orderShema = new mongoose.Schema({

    //client
    client: { type: String, enum:['client1','client2','client3'] , required : true},

    //created by
    createdBy : { type: String,required : true},

    //created at
    createdAt : { type: Date, default : Date.now()},

    //quai
    quai: { type: String,enum:['1','2','3','4','5'] , required : true, default : "1"}, //'0.5M','1M','1.5M','1G','0.33G'

    //model
    model: { type: String,enum:['A','B','C','D','E'] , required : true}, //'0.5M','1M','1.5M','1G','0.33G'
    
    //status
    status: {
        type: String,
        enum: ['Pending', 'Validated', 'Shipped', 'Canceled'],
        default: 'Pending'
      },

    //palettes quantity
    quantity : { type: String, default : Date.now()},



})