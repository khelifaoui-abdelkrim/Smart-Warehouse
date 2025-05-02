const Pallet = require('../models/pallet');

//register palette ✅
exports.registerPalette = async (req,res) =>{
    try{
        const {rfid,location,operator} = req.body;
        let pallette = await Pallet.findOne({rfid ,deleted : false});
        if(pallette){
            return res.status(400).json({ message: "Pallet already exists" });
        }
        pallette = new Pallet({
            rfid,
            location : location,
            last_scan:  new Date()
        })
        await pallette.save();
        return res.status(201).json({ message: "Pallet/Log saved  ✅ :" ,pallette});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}
//update palette status ✅
exports.updateStatus = async (req, res) => {
    try {
        const { rfid, status } = req.body;

        if (!rfid || !status) {
            return res.status(400).json({ message: "rfid and status are required" });
        }

        const pal = await Pallet.findOne({ rfid, deleted: false });

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
        const pallets = await Pallet.find({deleted : false , current_status: 'validated'}); // Fetch all pallets
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//validate lot✅
//validate a lot (a lot is pallets produced on 24h)
exports.valideLot = async (req, res) => {
    try {
        const {lot} = req.params;
        const start = new Date(lot);
        start.setUTCHours(0, 0, 0, 0);
        // End of day (e.g. 2025-05-01T23:59:59.999Z)
        const end = new Date(lot);
        end.setUTCHours(23, 59, 59, 999);
        
        const pallets = await Pallet.updateMany({deleted : false ,last_scan: { $gte: start, $lt: end }} , {$set :{current_status : "validated"}});
        if(pallets.modifiedCount === 0){
            return res.status(404).json({message : "no pallet found for that date"});
        }
        return res.status(200).json({ message: `✅ ${pallets.modifiedCount} pallet(s) validated.` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

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
        const {rfid} = req.params;
        const pallets = await Pallet.findOne({rfid , deleted : false},
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
       const {rfid} = req.params;
    //    if (isNaN(rfid)) {
    //     return res.status(400).json({message : "RFID must be a number"});
    //    }
       const deletePallet = await Pallet.findOneAndUpdate(
        {rfid}, //the filter
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

