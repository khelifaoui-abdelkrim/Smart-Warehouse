const Config = require('../models/config');

//set palette model
exports.setPaletteModel = async (req, res) => {
    try {
      const { line, model } = req.body;
  
      if (!line || !model) {
        return res.status(400).json({ message: "Model or line not provided" });
      }
  
      const currentLine = `line_${line}`;
  
      let config = await Config.findOne({ key: "line_models" });
  
      if (!config) {
        // First entry: create new config
        config = new Config({
          key: "line_models",
          value: new Map([[currentLine, model]])
        });
      } else {
        // Update or add the line
        config.value.set(currentLine,model);
      }
  
      await config.save();
  
      return res.status(200).json({
        message: `Model successfully set to '${model}' for line '${line}'`,
        model: config.value
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  

//get palette model (for one line)
exports.getPaletteModel = async (req,res) =>{
    try{
        const {line} = req.params;
        const currentLine = `line_${line}`;
        let config = await Config.findOne({key : "line_models"}); //line A/B/C

        if(!config || !config.value.get(currentLine)){
            return res.status(404).json({ message: `model are not setted on ${currentLine}` });
        }
        return res.status(200).json({ message: `current model for ${currentLine} : `, model : config.value.get(currentLine) });
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}

//get all models
exports.getAllModels = async (req,res) =>{
  try{
      let config = await Config.findOne({key :"line_models"}); //line A/B/C

      if(!config){
          res.status(404).json({ message: `there is no model setted` });
          //set models by default
          config = new Config({
            key: "line_models",
            value: new Map([["line_A", "A"],["line_B", "A"],["line_C", "A"]])
          });
      }
      return res.status(200).json({ message: "current models : ", models : config.value });
  }
  catch(err){
      return res.status(500).json(err.message);
  }
}