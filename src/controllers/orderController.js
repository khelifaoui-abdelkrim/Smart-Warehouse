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
            current_status: { $in: ['V', 'QR'] },
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

//delete pallets for a specified order (soft delete) ✅
exports.deletePalletOrder = async (req , res) =>{
    try {
       const {dock} = req.params;
       const {palette_id} = req.body;

       const order = await Order.find({assignedPallets : palette_id});

       //first check if the pallet belongs to an order
       if(!order || order.length === 0){
        return res.status(404).json({message : "this palette don't belong to any order"});
       }

       //then check if this order is detected by the right dock
       const order_dock = order[0].dock;
       if(order_dock !== dock){
        return res.status(404).json({message : `wrong dock ${dock} for this pallet ${order_dock}`});
       }

       //finnaly soft delete the palette
       const deletePal = await Pallet.findOneAndUpdate(
        {palette_id, deleted : false},
        {$set : {deleted : true, last_scan : Date.now()}},
        {new : true}
       );

       if(!deletePal){
        return res.status(404).json({message : "palette not found in DB or already deleted"});
       }

       res.status(200).json({
        message :`pallet ${palette_id} deleted succesfuly !` ,
        dock : order_dock
       })

    } catch (err) {
        res.status(500).json({message : "server error : ",error : err.message });
    }
}