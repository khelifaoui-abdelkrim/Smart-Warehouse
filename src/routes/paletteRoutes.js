const express = require('express');
const Pallet = require('../models/pallet')
const Pallet = require('../models/scanLog')



const {registerPalette,updateStatus, getAll,getDeleteAll,getPalette,deletePalette,deleteAll,restoreAll} = require("../controllers/paletteController");
const router = express.Router();

//add pallets✅
router.post('/add', registerPalette);

//return all pallets✅
router.get('/all', getAll);

//return all deleted pallets✅
router.get('/alld', getDeleteAll);

//return a  specified pallet✅
router.get('/:rfid', getPalette);
//update pallets status ✅
router.put('/update',updateStatus );

//soft delete all pallets ✅
router.put('/all', deleteAll);

//restore all pallets ✅
router.put('/alld', restoreAll);

//soft delete pallet ✅
router.put('/:rfid', deletePalette);


module.exports = router;