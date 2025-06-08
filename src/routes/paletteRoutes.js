const express = require('express');
// const Pallet = require('../models/pallet')
const {authMiddleware} = require('../middleware/authMiddleware') // add auth middleware to secure those actions bellow



const {registerPalette,updateStatus, getAll,getDeleteAll,getAllvalidated,changeLotStatus,getQuarantineModelsQuantity,getPalette,getValidatedModelsQuantity,getModelsQuantity,deletePalette,deleteAll,HdeleteAll,restoreAll,modelCounter,deletePalletOrder,getAllLots} = require("../controllers/paletteController");
const router = express.Router();

///////////////////////////////////////////////
///one pallete////
///////////////////////////////////////////////

//register palette ✅
router.post('/pallete/add',authMiddleware,registerPalette);

//return a  specified pallet✅
router.get('/pallete/:palette_id',authMiddleware, getPalette);

//update pallets status ✅
router.put('/pallete/update', authMiddleware,updateStatus );

//soft delete pallet ✅
router.put('/pallete/:palette_id', authMiddleware, deletePalette);

///////////////////////////////////////////////
///multi palletes////
///////////////////////////////////////////////

//return all pallets✅
router.get('/all',authMiddleware, getAll);

//return all deleted pallets✅
router.get('/alld',authMiddleware,getDeleteAll);

//return all validated pallets✅
router.get('/allv',authMiddleware, getAllvalidated);

router.delete('/all',authMiddleware, HdeleteAll);

//soft delete all pallets ✅
router.put('/all', authMiddleware, deleteAll);

//hard delete all pallets ✅
router.delete('/all', authMiddleware, HdeleteAll);


//restore all pallets ✅
router.put('/alld',authMiddleware, restoreAll); 

//restore all pallets ✅
router.get('/:model',authMiddleware, modelCounter); 

//get quantity of all pallets per model✅
router.get('/models/all', getModelsQuantity); 

//get quantity of all validated pallets per model✅
router.get('/models/allv', getValidatedModelsQuantity);

//get quantity of all "Q" pallets per model✅
router.get('/models/allq', getQuarantineModelsQuantity);

//############################## lot operations ##########################/////

//get all lots ✅
router.get('/lots/all',authMiddleware, getAllLots); 

//change Lot status✅  
router.put('/lots/status/',authMiddleware, changeLotStatus);


module.exports = router;