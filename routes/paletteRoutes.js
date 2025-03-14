const express = require('express');
const Pallet = require('../models/pallet')


const router = express.Router();

//add pallets
router.post('/add', async (req,res) =>{
    try{
        const {rfid} = req.body;
        let pallette = await Pallet.findOne({rfid});
        if(pallette){
            return res.status(400).json({ message: "Pallet already exists" });
        }
        pallette = new Pallet({
            rfid,
            timestamps: [{ event: "Produced", time: new Date() }]
        })
        await pallette.save();
        res.status(201).json({ message: "Pallet saved  ✅ :" ,pallette});
    }
    catch(err){
        res.status(500).json(err.message);
    }
})

//update pallets
router.put('/update', async (req, res) => {
    try{
        const {rfid,status,location} = req.body;
        let pal = await Pallet.findOne({rfid});
        if(!pal){
           return res.status(404).json({message : "pallet not found"});
        } 
        pal.status = status;
        pal.location = location;

        await pal.save();
        res.status(200).json({message : "pallet updated !!! ",pal});
    }
    catch(err){
        res.status(500).json({error : err.message})
    }
})

//return all pallets
router.get('/all', async (req, res) => {
    try {
        const pallets = await Pallet.find(); // Fetch all pallets
        res.status(200).json(pallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//return a  specified pallet
router.get('/:rfid', async (req, res) => {
    try {
        const pallets = await Pallet.findOne({rfid : req.params.rfid}); // Fetch all pallets
        res.status(200).json(pallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//delete pallets
router.delete('/:rfid', async (req , res) =>{
    try {
       const {rfid} = req.params;
       const deletePallet = await Pallet.findOneAndDelete({rfid});
       if(!deletePallet){
        return res.status(404).json({message : "pallet not found"});
       }
       res.status(200).json({message :"pallet deleted succesfuly !" })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

//delete all pallets
router.delete('/', async (req , res) =>{
    try {
       const deleteAllPallet = await Pallet.deleteMany({});
       if(!deleteAllPallet){
        return res.status(404).json({message : "no pallet to delete"});
       }
       res.status(200).json({message : `${deleteAllPallet.deletedCount} pallets deleted succesfuly !` })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;