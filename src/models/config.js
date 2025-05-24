const mongoose = require('mongoose');

//this shema is global, like we can set many types with a value, for ex : key : model , value :"1.5L"
const configShema = new mongoose.Schema({
    //the key, it must be "model", to desting from further config in this file
    key : {type : String , required : true, unique : true},
    //set the value of productio
    value : {type : Map, of : String, default : {} ,required : true}
},
{ versionKey: false }//  This removes __v)
);

module.exports = mongoose.model('config',configShema);