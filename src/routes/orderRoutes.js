const express = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const {createOrder,getAllPending,getAllShipped,deletePalletOrder} = require('../controllers/orderController')
const router = express.Router();


//create an order ✅
router.post('/create',authMiddleware,createOrder);

//get all pending orders ✅
router.get('/pending/all',getAllPending);

//get all shipped orders ✅
router.get('/shipped/all',getAllShipped);

//delete a pallet of orders (soft del)  esp32✅
router.put('/:dock/delete',deletePalletOrder);

module.exports = router;