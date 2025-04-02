const Pallet = require('../models/pallet');
const ScanLog = require('../models/scanLog')


//register palette ✅
const registerPalette = async (req,res) =>{
    try{
        const {rfid,location} = req.body;
        let pallette = await Pallet.findOne({rfid ,deleted : false});
        if(pallette){
            return res.status(400).json({ message: "Pallet already exists" });
        }
        pallette = new Pallet({
            rfid,
            location : location,
            last_scan:  new Date() 
        })
        Log = new ScanLog({
            rfid,
            location ,
            operator 
        })
        await pallette.save();
        await Log.save();
        return res.status(201).json({ message: "Pallet/Log saved  ✅ :" ,pallette});
    }
    catch(err){
        return res.status(500).json(err.message);
    }
}
//update palette status ✅
const updateStatus = async (req, res) => {
    try{
        const {rfid,status} = req.body;
        let pal = await Pallet.findOne({rfid, deleted : false});
        if(!pal){
           return res.status(404).json({message : "pallet not found"});
        }
        let tim = pal.timestamps; 
        if(tim.length >0){
            tim[tim.length -1].status = status;
            tim[tim.length -1].time = new Date();
        }
        else{
            pal.timestamps.push({
                time : new Date(),
                status : status
            })
        }

        await pal.save();
        return res.status(200).json({message : "pallet updated !!! ",pal});
    }
    catch(err){
        return res.status(500).json({error : err.message})
    }
} 

//get all pallets✅
const getAll = async (req, res) => {
    try {
        const pallets = await Pallet.find({deleted : false}); // Fetch all pallets
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//delete all pallets (soft delete)✅
const getDeleteAll = async (req , res) =>{
    try {
        const pallets = await Pallet.find({deleted : true}); // Fetch all pallets
        return res.status(200).json(pallets);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//return a  specified pallet ✅
const getPalette = async (req, res) => {
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
const deletePalette = async (req , res) =>{
    try {
       const {rfid} = req.params;
       if (isNaN(rfid)) {
        return res.status(400).json({message : "RFID must be a number"});
       }
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
const deleteAll = async (req , res) =>{
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
//restore all deletedpallets (soft delete)✅
const restoreAll = async (req , res) =>{
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


module.exports = {updateStatus,getAll,getDeleteAll,registerPalette,getPalette,deletePalette,deleteAll,restoreAll};
