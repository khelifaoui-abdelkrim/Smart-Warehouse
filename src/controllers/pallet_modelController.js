const Config = require('../models/config');

//set palette model
exports.setPaletteModel = async (req,res) =>{
    try{
        const {model} = req.body;
        if(!model){
            return res.status(400).json({ message: "Model not provided"});
        }
        let config = await Config.findOneAndUpdate(
            {key : "model"},
            {value : model},
            { new: true, upsert: true }
        )
        return res.status(200).json(
            { message: `Model updated succefully to : , ${model}`,
            model : config.value
            }
        );
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

//get palette model
exports.getPaletteModel = async (req,res) =>{
    try{
        let config = await Config.findOne({key : "model"});
        if(!config){
            //set default value
            config  = new Config({key : "model", value: "A"});
            await config.save();
        }
        return res.status(200).json({ message: "current model : ", model : config.value });
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}