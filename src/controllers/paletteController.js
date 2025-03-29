const Pallet = require('../models/pallet')

//register palette 
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
            timestamps: [{ time: new Date() }] 
        })
        await pallette.save();
        res.status(201).json({ message: "Pallet saved  ✅ :" ,pallette});
    }
    catch(err){
        res.status(500).json(err.message);
    }
}
//update palette status
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
                status : timestamps.status
            })
        }

        await pal.save();
        res.status(200).json({message : "pallet updated !!! ",pal});
    }
    catch(err){
        res.status(500).json({error : err.message})
    }
} 

//get all pallets
const getAll = async (req, res) => {
    try {
        const pallets = await Pallet.find({deleted : false}); // Fetch all pallets
        res.status(200).json(pallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//return a  specified pallet
const getPalette = async (req, res) => {
    try {
        const {rfid} = req.params;
        const pallets = await Pallet.findOne({rfid , deleted : false},
        );  
        if(!pallets){
            res.status(404).json("palette not found !");
        }
        res.status(200).json(pallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//delete a specified pallet (soft delete)
const deletePalette = async (req , res) =>{
    try {
       const {rfid} = req.params;
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

//delete all pallets (soft delete)
const deleteAll = async (req , res) =>{
    try {
       const deleteAllPallet = await Pallet.updateMany({deleted : false} , {$set :{deleted : true}});
       if(!deleteAllPallet){
        return res.status(404).json({message : "no pallet to delete"});
       }
       res.status(200).json({message : `${deleteAllPallet.modifiedCount} pallets deleted succesfuly !` })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {updateStatus,getAll,registerPalette,getPalette,deletePalette,deleteAll};
