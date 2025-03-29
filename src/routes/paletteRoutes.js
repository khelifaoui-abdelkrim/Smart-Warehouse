const express = require('express');
const Pallet = require('../models/pallet')


const {registerPalette,updateStatus, getAll,getPalette,deletePalette,deleteAll} = require("../controllers/paletteController");
const router = express.Router();

//add pallets
router.post('/add', registerPalette);

//update pallets location 
router.put('/update',updateStatus );

//return all pallets
router.get('/all', getAll);

//return a  specified pallet
router.get('/:rfid', getPalette);

//delete pallets
router.delete('/:rfid', deletePalette);

//hard delete all pallets
router.put('/', deleteAll);

//hard delete all pallets
router.delete('/', deleteAll);

module.exports = router;