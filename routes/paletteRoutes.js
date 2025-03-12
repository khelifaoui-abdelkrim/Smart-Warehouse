const express = require('express');
const Pallet = require('../models/pallet')


const router = express.Router();

router.post('add', async (req,res) =>{
    const {rfid} = req.body;

    try{
        let pallette = await Pallet.findOne({rfid});
        if(pallette){
            return res.status(400).json({ message: "Pallet already exists" });
        }
        pallette = new Pallet({
            rfid,
            imestamps: [{ event: "Produced", time: new Date() }]
        })
        await pallette.save();
        res.status(201).json({ message: "Pallet saved : ✅\n " },pallet);
    }
    catch(err){
        res.status(500).json(err.message);
    }
})