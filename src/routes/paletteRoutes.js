const express = require('express');
// const Pallet = require('../models/pallet')
const {authMiddleware} = require('../middleware/authMiddleware') // add auth middleware to secure those actions bellow



const {registerPalette,updateStatus, getAll,getDeleteAll,getAllvalidated,valideLot,getPalette,deletePalette,deleteAll,HdeleteAll,restoreAll} = require("../controllers/paletteController");
const router = express.Router();

///////////////////////////////////////////////
///one pallete////
///////////////////////////////////////////////

//register palette ✅
router.post('/pallete/add', registerPalette);

//return a  specified pallet✅
router.get('/pallete/:palette_id', getPalette);

//update pallets status ✅
router.put('/pallete/update',updateStatus );

//soft delete pallet ✅
router.put('/pallete/:palette_id', deletePalette);

///////////////////////////////////////////////
///multi palletes////
///////////////////////////////////////////////

//return all pallets✅
router.get('/all',  getAll);

//return all deleted pallets✅
router.get('/alld', getDeleteAll);

//return all validated pallets✅
router.get('/allv',  getAllvalidated);router.delete('/all', HdeleteAll);

//validate a Lot✅   /validate/03-05-2025 
router.put('/validate/:lot', valideLot);

//soft delete all pallets ✅
router.put('/all', deleteAll);

//hard delete all pallets ✅
router.delete('/all', HdeleteAll);


//restore all pallets ✅
router.put('/alld',authMiddleware, restoreAll);



module.exports = router;