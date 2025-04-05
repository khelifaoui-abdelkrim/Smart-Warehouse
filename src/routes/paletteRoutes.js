const express = require('express');
// const Pallet = require('../models/pallet')
const {authMiddleware} = require('../middleware/authMiddleware') // add auth middleware to secure those actions bellow



const {registerPalette,updateStatus, getAll,getDeleteAll,getPalette,deletePalette,deleteAll,restoreAll} = require("../controllers/paletteController");
const router = express.Router();

//register palette ✅
router.post('/add',authMiddleware, registerPalette);

//return all pallets✅
router.get('/all',authMiddleware, getAll);

//return all deleted pallets✅
router.get('/alld',authMiddleware, getDeleteAll);

//return a  specified pallet✅
router.get('/:rfid',authMiddleware, getPalette);
//update pallets status ✅
router.put('/update',authMiddleware,updateStatus );

//soft delete all pallets ✅
router.put('/all',authMiddleware, deleteAll);

//restore all pallets ✅
router.put('/alld',authMiddleware, restoreAll);

//soft delete pallet ✅
router.put('/:rfid',authMiddleware, deletePalette);


module.exports = router;