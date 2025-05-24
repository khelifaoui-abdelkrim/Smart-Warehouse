const Pallet = require('../models/pallet')
const Order = require('../models/order');
const { getDeleteAll } = require('./paletteController');

//create an order
exports.createOrder = async (req,res) =>{

    try {
        const {client, dock, products} = req.body;
        const createdBy = req.user.username;

        //first get the products content 
        const gatheredProducts = [];
        
        for(const product of products){
            const {model, quantity} = product;
            //find available pallets for this model
            const availablePallets = await Pallet.find({
                model,
                current_status: { $in: ['V', 'QR'] },
                ordered : false,
                deleted: false
            }).limit(quantity);

            //verify if there is enough pallets
            if(availablePallets.length < quantity){
                return res.status(400).json({ message: 'Not enough pallets available/valide to fulfill the order.' });
            }

            const assignedPallets = availablePallets.map(p => p.palette_id); //selected pallets to ship

            //now we should first change the ordered status to true
            await Pallet.updateMany(
                {palette_id : {$in : assignedPallets} },
                {$set:  {ordered : true} }
            )

            gatheredProducts.push({
                model,
                quantity,
                assignedPallets : []
            })
        }

        //now create the order
        const newOrder = new Order({
            client,
            createdBy,
            dock,
            products : gatheredProducts,
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
//dagi vedel assigned pallets
//delete pallets for a specified order (soft delete) ✅
exports.deletePalletOrder = async (req , res) =>{
    try {
       const {dock} = req.params;
       const {palette_id} = req.body;
       
       const pallet = await Pallet.findOne({
        palette_id,
        deleted : false
       })


       //1-first check if the pallet exists
       if (!pallet) {
        return res.status(404).json({ message: "Pallet not found or already deleted" });
       }

       //extract the pallete model 
       const { model } = pallet;

       const order = await Order.findOne({
        dock,
        status : "Pending",
        "products.model" : model
       });

       //2-check if the order is shipped or not correstponding to the pallet
       if(!order){
        return res.status(404).json({message : "this palette cant be assigned to this order"});
       }

       //3-find the matching assert for the pallete in the order

       const product = order.products.find(p => p.model === model)

       if(!product || product.assignedPallets.length >= product.quantity){
        return res.status(404).json({message : `Order at dock ${dock} has already all pallets for the model ${model}, or its already shipped`});
       }

       //4-so now we can delete the pallete and assert it to the order
       pallet.deleted = true;
       pallet.last_scan = Date.now();
       await pallet.save();

       product.assignedPallets.push(palette_id)

       //5- check if the order is fully assigned to mark it as "shipped"
       const allAssigned = order.products.every(p => p.assignedPallets.length === Number(p.quantity));

       if(allAssigned){
        order.status = "Shipped";
        order.shippedAt = Date.now();
       }
       await order.save();

       return res.status(200).json({
        message :`pallet ${palette_id} deleted succesfuly !` ,
        dock ,
        assignedToOrder: order.order_id,
        orderStatus : order.status
       })

    } catch (err) {
        return  res.status(500).json({message : "server error : ",error : err.message });
    }
}

//get shipping porgress of an order
exports.getShippingProgress = async (req,res) =>{
    try {
        const {order_id} = req.params;

        const findOrder = await Order.findOne({order_id});
        if(findOrder.length === 0){
            return res.status(404).json({message : "no order found"});
        }

        // Step 1: Flatten all assigned pallet IDs from all products
        // const allAssignedPallets = findOrder.products.flatMap(product => product.assignedPallets);

        const totalPallets =  findOrder.products.flatMap(p => p.assignedPallets)
        const totalQuantity = findOrder.products.reduce((sum, product) => sum + parseInt(product.quantity), 0);
        const deletdPallets = await Pallet.find({
            palette_id : {$in: totalPallets},
            deleted :true
        })
        
        const remainingPallets = await Pallet.find({
            palette_id : {$in: totalPallets},
            deleted :false
        })

        return res.status(200).json({
            message : `progress : ${deletdPallets.length}/${totalQuantity} `,
            remainingPallets : remainingPallets.map(p => p.palette_id)
        });
    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}