const express = require('express');
const Pallet = require('../models/pallet')


const {registerPalette,updateStatus, getAll,getPalette,deletePalette,deleteAll} = require("../controllers/paletteController");
const router = express.Router();

//add pallets
router.post('/add', registerPalette);

//update pallets status 
router.put('/update',updateStatus );

//return all pallets
router.get('/all', getAll);

//return a  specified pallet
router.get('/:rfid', getPalette);

//soft delete pallet
router.put('/:rfid', deletePalette);

//soft delete all pallets
router.put('/', deleteAll);

module.exports = router;