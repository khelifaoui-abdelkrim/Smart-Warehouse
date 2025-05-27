const express = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const {createOrder,getAllOrders,getOrder,getAllPending,getAllShipped,deletePalletOrder,getShippingProgress,getAvailablePalleteModel,cancelOrder,getAllCanceled,getAssigned} = require('../controllers/orderController')
const router = express.Router();


//create an order ✅
router.post('/create',authMiddleware,createOrder); //il faut se connecter pour utiliser le nom de utilisateur actuel dans le bon

//delete a pallet of orders (soft del)  esp32✅ pour karim
router.put('/:dock/delete',deletePalletOrder);

//cancel an order✅
router.put('/cancel/:order_id',cancelOrder);

//get all  orders ✅
router.get('/all',getAllOrders);

//get order by id ✅
router.get('/order/:order_id',getOrder);

//get all pending orders ✅
router.get('/pending/all',getAllPending);

//get all shipped orders ✅
router.get('/shipped/all',getAllShipped);

//get all Canceled orders ✅
router.get('/canceled/all',getAllCanceled);

//get shipping progress for an order✅
router.get('/progress/:order_id',getShippingProgress);

//get available pallets for a model✅
router.get('/pallets/available/:model',getAvailablePalleteModel);

//get orders which have pallets of a specified lot✅
router.get('/assigned/:lot',getAssigned);


module.exports = router;