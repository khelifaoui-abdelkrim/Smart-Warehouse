const express = require('express');
// const Pallet = require('../models/pallet')
const {authMiddleware} = require('../middleware/authMiddleware') // add auth middleware to secure those actions bellow



const {registerPalette,updateStatus, getAll,getDeleteAll,getAllvalidated,changeLotStatus,getPalette,deletePalette,deleteAll,HdeleteAll,restoreAll,modelCounter,deletePalletOrder,getAllLots} = require("../controllers/paletteController");
const router = express.Router();

///////////////////////////////////////////////
///one pallete////
///////////////////////////////////////////////

//register palette ✅
router.post('/pallete/add',registerPalette);

//return a  specified pallet✅
router.get('/pallete/:palette_id', getPalette);

//update pallets status ✅
router.put('/pallete/update', authMiddleware,updateStatus );

//soft delete pallet ✅
router.put('/pallete/:palette_id', authMiddleware, deletePalette);

///////////////////////////////////////////////
///multi palletes////
///////////////////////////////////////////////

//return all pallets✅
router.get('/all', getAll);

//return all deleted pallets✅
router.get('/alld',getDeleteAll);

//return all validated pallets✅
router.get('/allv', getAllvalidated);

router.delete('/all', HdeleteAll);

//soft delete all pallets ✅
router.put('/all', authMiddleware, deleteAll);

//hard delete all pallets ✅
router.delete('/all', authMiddleware, HdeleteAll);


//restore all pallets ✅
router.put('/alld',authMiddleware, restoreAll); 

//restore all pallets ✅
router.get('/:model', modelCounter); 



//############################## lot operations ##########################/////

//get all lots ✅
router.get('/lots/all', getAllLots); 

//change Lot status✅  
router.put('/lots/status/', changeLotStatus);


module.exports = router;