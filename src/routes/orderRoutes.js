const express = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const {createOrder,getAllPending,getAllShipped} = require('../controllers/orderController')
const router = express.Router();


//create an order ✅
router.post('/create',authMiddleware,createOrder);

//get all pending orders ✅
router.get('/pending/all',getAllPending);

//get all shipped orders ✅
router.get('/shipped/all',getAllShipped);

module.exports = router;