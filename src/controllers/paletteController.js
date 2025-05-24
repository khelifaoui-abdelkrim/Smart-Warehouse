const Pallet = require('../models/pallet');
const Config = require('../models/config');



//function to generate a lot identifier 
function lotGenerator(fabrication = new Date(),location = "A",model = "A") {
    const year = fabrication.getFullYear().toString().slice(-2); // 25 for example
    
    //day of year calculation
    const start = new Date(fabrication.getFullYear(), 0, 0);
    const diff = fabrication - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const dayStr = dayOfYear.toString().padStart(3, '0'); // 099

    return `${year}${location}${model}${dayStr}`;
}

///################################# Pallets operations #########################################////

//register palette ✅
exports.registerPalette = async (req,res) =>{
    try{
        const {palette_id,location,line} = req.body;
        let pallete = await Pallet.findOne({palette_id ,deleted : false});
        let config = await Config.findOne({key :"line_models"}); // get the model form the config collection

        if(pallete){
            return res.status(400).json({ message: "Pallet already exists" });
        }
        //get the current model 
        const model = config.value.get(line);

        //define expiration and fabrication date
        const fabricationDate = new Date();
        const expirationDate = new Date(fabricationDate);
        expirationDate.setFullYear(fabricationDate.getFullYear()+1)

        pallete = new Pallet({
            palette_id : palette_id,
            location : location,
            model : model,
            lot : lotGenerator(fabricationDate,location,model),
            fabrication : fabricationDate,
            expiration : expirationDate
        })
        await pallete.save();
        return res.status(201).json({ message: "Pallet/Log saved  ✅ :" ,pallete});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}
//update palette status ✅
exports.updateStatus = async (req, res) => {
    try {
        const { palette_id, status } = req.body;

        if (!palette_id || !status) {
            return res.status(400).json({ message: "palette_id and status are required" });
        }

        const pal = await Pallet.findOne({ palette_id, deleted: false });

        if (!pal) {
            return res.status(404).json({ message: "Pallet not found" });
        }

        pal.current_status = status;
        pal.last_scan = new Date();

        await pal.save();

        return res.status(200).json({ message: "Pallet updated ✅", pal });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


//get all pallets✅
exports.getAll = async (req, res) => {
    try {
        const pallets = await Pallet.find({deleted : false}); // Fetch all pallets
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//get all validated pallets✅
exports.getAllvalidated = async (req, res) => {
    try {
        const pallets = await Pallet.find({deleted : false , current_status: 'V'}); // Fetch all pallets
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


// exports.changeLotStatus = async (req, res) => {
//     try {
//         const {lot} = req.params;
//         const start = new Date(lot);
//         start.setUTCHours(0, 0, 0, 0);
//         // End of day (e.g. 2025-05-01T23:59:59.999Z)
//         const end = new Date(lot);
//         end.setUTCHours(23, 59, 59, 999);
        
//         const pallets = await Pallet.updateMany({deleted : false ,last_scan: { $gte: start, $lt: end }} , {$set :{current_status : "V"}});
//         if(pallets.modifiedCount === 0){
//             return res.status(404).json({message : "no pallet found for that date"});
//         }
//         return res.status(200).json({ message: `✅ ${pallets.modifiedCount} pallet(s) validated.` });
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// }

//get delete all pallets (soft delete)✅
exports.getDeleteAll = async (req , res) =>{
    try {
        const pallets = await Pallet.find({deleted : true}); // Fetch all pallets
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//return a  specified pallet ✅
exports.getPalette = async (req, res) => {
    try {
        const {palette_id} = req.params;
        const pallets = await Pallet.findOne({palette_id , deleted : false},
        );  
        if(!pallets){
            return res.status(404).json("palette not found !");
        }
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//delete a specified pallet (soft delete) ✅
exports.deletePalette = async (req , res) =>{
    try {
       const {palette_id} = req.params;
    //    if (isNaN(palette_id)) {
    //     return res.status(400).json({message : "palette_id must be a number"});
    //    }
       const deletePallet = await Pallet.findOneAndUpdate(
        {palette_id}, //the filter
        {deleted : true}, //the update
        {new : true} // the option
       );
       if(!deletePallet){
        return res.status(404).json({message : "pallet not found"});
       }
       res.status(200).json({message :"pallet deleted succesfuly !" })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


//delete all pallets (soft delete) ✅
exports.deleteAll = async (req , res) =>{
    try {
       const deleteAllPallet = await Pallet.updateMany({deleted : false} , {$set :{deleted : true}});
       if(!deleteAllPallet){
        return res.status(404).json({message : "no pallet to delete"});
       }
       return res.status(200).json({message : `${deleteAllPallet.modifiedCount} pallets deleted succesfuly !` })

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//delete all pallets (hard delete) ✅
exports.HdeleteAll = async (req , res) =>{
    try {
       const result = await Pallet.deleteMany({});
       return res.status(200).json({message : `${result.deletedCount} pallets deleted succesfuly !` })

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


//restore all deletedpallets (soft delete)✅
exports.restoreAll = async (req , res) =>{
    try {
       const deleteAllPallet = await Pallet.updateMany({deleted : true} , {$set :{deleted : false}});
       if(!deleteAllPallet){
        return res.status(404).json({message : "no pallet to restore"});
       }
       return res.status(200).json({message : `${deleteAllPallet.modifiedCount} pallets restored succesfuly !` })

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//model counter✅
exports.modelCounter = async (req , res) =>{
    try {
       const model = req.params.model;
       const count = await Pallet.countDocuments({model : model});
       if(count === 0 ){
        return res.status(404).json({message : "model not available"});
       }
       return res.status(200).json({ message: `${count} pallets` });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

////####################### lot controller ###############################////////

//change lot status ✅
//change lot status(a lot is pallets produced on 24h)
exports.changeLotStatus = async (req, res) => {
    try {
        const {lot,current_status} = req.body;
        
        const pallets = await Pallet.updateMany({deleted : false ,lot: lot} , {$set :{current_status : current_status}});
        if(pallets.modifiedCount === 0){
            return res.status(404).json({message : "no pallets found for that lot or no status to change"});
        }
        return res.status(200).json({ message: `status changed to ${current_status} for ${pallets.modifiedCount} pallet(s)` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// get all lots with info ✅
exports.getAllLots =  async (req, res) => {
    try {
      const lots = await Pallet.aggregate([ // we used aggregate cause it offers several params
        { $match: { deleted: false } },
        { 
          $group: {
            _id: "$lot", //lot: {$first: "$lot"}, 
            count: { $sum: 1 },
            status : {$first: "$current_status"},
            pallets : {$push : "$palette_id"}
          }
        },
      ]);
      res.status(200).json(lots);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
