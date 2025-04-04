const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    //username
    username: { type: String, required: true, unique: true },
    //password
    password: {type : String ,required: true },
    //operator
    role: { type: String , enum : ["operator" , "admin"], required : true},
},
{ versionKey: false }//  This removes __v)
); 
module.exports = mongoose.model('User',userShema);