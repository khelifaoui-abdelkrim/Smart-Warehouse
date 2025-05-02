const express = require('express');
// const Pallet = require('../models/pallet')
const {authMiddleware} = require('../middleware/authMiddleware') // add auth middleware to secure those actions bellow



const {registerPalette,updateStatus, getAll,getDeleteAll,getAllvalidated,valideLot,getPalette,deletePalette,deleteAll,HdeleteAll,restoreAll} = require("../controllers/paletteController");
const router = express.Router();

//register palette ✅
router.post('/add', registerPalette);

//return all pallets✅
router.get('/all',  getAll);

//return all deleted pallets✅
router.get('/alld', getDeleteAll);

//return all validated pallets✅
router.get('/allv',  getAllvalidated);

//validate multi sepcified pallets✅
router.put('/validate/:lot', valideLot);

//return a  specified pallet✅
router.get('/:rfid', getPalette);

//update pallets status ✅
router.put('/update',updateStatus );

//soft delete all pallets ✅
router.put('/all', deleteAll);

//hard delete all pallets ✅
router.delete('/all', HdeleteAll);

//restore all pallets ✅
router.put('/alld',authMiddleware, restoreAll);

//soft delete pallet ✅
router.put('/:rfid', deletePalette);


module.exports = router;