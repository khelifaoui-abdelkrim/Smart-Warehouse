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

        let config = await Config.findOne({key : "line_models"}); //line A/B/C

        if(!config || !config.value[line]){
            return res.status(404).json({ message: `model are not setted on ${line}` });
        }
        return res.status(200).json({ message: "current model : ", model : config.value[line] });
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}