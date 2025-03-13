const express = require('express');
const Pallet = require('../models/pallet')


const router = express.Router();

//add pallets
router.post('/add', async (req,res) =>{
    const {rfid} = req.body;

    try{
        let pallette = await Pallet.findOne({rfid});
        if(pallette){
            return res.status(400).json({ message: "Pallet already exists" });
        }
        pallette = new Pallet({
            rfid,
            timestamps: [{ event: "Produced", time: new Date() }]
        })
        await pallette.save();
        res.status(201).json({ message: "Pallet saved : ✅\n " },pallette);
    }
    catch(err){
        res.status(500).json(err.message);
    }
})

//update pallets
router.put('/update', async (req, res) => {
    const {rfid,status,location} = req.body
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
module.exports = router;