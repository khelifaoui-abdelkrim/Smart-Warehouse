const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    //username
    username: { type: String, required: true, unique: true },
    //name
    name: { type: String, required: true  },
    //lastname
    lastname: { type: String, required: true },
    //email
    email: { type: String, required: true, unique: true },
    //phone
    phone: { type: String, required: true, unique: true },
    //password
    password: {type : String ,required: true },
    //createdAt
    createdAt: {type : Date ,default : Date.now() },
    //validated or not
    validated: { type: Boolean, default: false },
    //operator
    role: { type: String , enum : ["operateur_prod" ,"operateur_exped" ,"operateur_lab" , "admin"], required : true},
},
{ versionKey: false }//  This removes __v)
); 
module.exports = mongoose.model('User',userShema);