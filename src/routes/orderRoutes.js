const express = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const {createOrder,getAllPending,getAllShipped,deletePalletOrder,getShippingProgress} = require('../controllers/orderController')
const router = express.Router();


//create an order ✅
router.post('/create',authMiddleware,createOrder); //il faut se connecter pour utiliser le nom de utilisateur actuel dans le bon

//get all pending orders ✅
router.get('/pending/all',getAllPending);

//get all shipped orders ✅
router.get('/shipped/all',getAllShipped);

//delete a pallet of orders (soft del)  esp32✅
router.put('/:dock/delete',deletePalletOrder);

//get shipping progress for an order✅
router.get('/progress/:order_id',getShippingProgress);
module.exports = router;