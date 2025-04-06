// this controller consists to scan a palette by user and save it for history (taracability)

const scanLog = require("../models/scanLog")
const Pallet = require('../models/Pallet');

exports.scanLog = async (req, res) => {
    try {
        const {rfid, location, action} = req.body
        const userID = req.user.userID // when the jwt run req.user = decoded 
        const palette = await Pallet.findOne({rfid})

        if(!palette){
            return res.status(404).json({message : "pallet not found"});
        }
        const newLog = new scanLog({
            palette : palette._id,
            user : userID,
            location : location,
            action : action
        })

        await newLog.save()
        return res.status(201).json({message : "action saved succefully  : ",log : newLog})
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}
//get the history of the user actions
exports.getScanLog = async (req, res) => {
    try {
        const userID = req.user.userID // when the jwt run req.user = decoded 
        const logs = await scanLog.findOne({rfid})

        return res.status(201).json({message : "action saved succefully  : ",log : newLog})
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}