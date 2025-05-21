const Pallet = require('../models/pallet')
const Order = require('../models/order');
const { getDeleteAll } = require('./paletteController');

//create an order
exports.createOrder = async (req,res) =>{

    try {
        const {client, dock, model, quantity} = req.body;
        const createdBy = req.user.username;

        const availablePallets = await Pallet.find({
            model,
            current_status: { $in: ['Q', 'QR'] },
            deleted: false
        }).limit(quantity);

        //verify if there is enough pallets
        if(availablePallets.length < quantity){
            return res.status(400).json({ message: 'Not enough pallets available to fulfill the order.' });
        }

        const assignedPallets = availablePallets.map(p => p.palette_id); //selected pallets to ship

        const newOrder = new Order({
            client,
            createdBy,
            dock,
            model,
            quantity,
            assignedPallets
        })

        await newOrder.save();

        res.status(201).json({ message: 'Order created and validated.', order: newOrder });

    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}


//get all pending orders 
exports.getAllPending = async (req,res) =>{
    try {
        const getAll = await Order.find({status : "Pending"})
        return res.status(200).json(getAll);

    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

//get all shipped orders 
exports.getAllShipped = async (req,res) =>{
    try {
        const getAll = await Order.find({status : "Shipped"})
        return res.status(200).json(getAll);
        
    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}