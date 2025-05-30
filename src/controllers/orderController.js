const Pallet = require('../models/pallet')
const Order = require('../models/order');
const { getDeleteAll } = require('./paletteController');

/////////////////////////////////////////////////////////////
//create an order✅
/////////////////////////////////////////////////////////////
exports.createOrder = async (req,res) =>{

    try {
        const {client, dock, products} = req.body;
        const createdBy = req.user.username;
        
        //function to assign order_id
        async function idGenerator2(){
            
        //get the last order id
        const lastOrderId = await Order.findOne({})
        .sort({ order_id: -1 }) // Sort descending
        .limit(1);

        let nextId = 1;

        if (lastOrderId && lastOrderId.order_id) {
            const numberPart = parseInt(lastOrderId.order_id.split('_')[1], 10);
            if (!isNaN(numberPart)) {
              nextId = numberPart + 1;
            }
          }
        
        return `order_${nextId}`;
        }

        //first get the products content 
        const gatheredProducts = [];

        const pending = await Order.find({status : "Pending"});
        for(const product of products){
            const {model, quantity} = product;

            //get the count of pallets ordered on pending orders
            let reservedCount = 0;

            for(const order of pending){
                const matchingProducts = order.products.find(p => p.model === model);
                const assigned = matchingProducts.assignedPallets || [];
                if(matchingProducts){
                    reservedCount += matchingProducts.quantity - assigned.length;
                }
            }           

            //find available pallets for this model
            const availablePallets = await Pallet.find({
                model,
                current_status: { $in: ['V', 'QR'] },
                // ordered : false,
                deleted: false
            });

            const availableCount = (availablePallets.length) - reservedCount ;
            //verify if there is enough pallets
            if(availableCount < quantity){
                return res.status(400).json({ message: 'Not enough pallets available/valide to fulfill the order.' });
            }
            const selectedPallets = availablePallets.slice(0,quantity)
            const assignedPallets = selectedPallets.map(p => p.palette_id); //selected pallets to ship
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
            order_id : await idGenerator2(),
            client,
            createdBy,
            dock,
            products : gatheredProducts,
        })

        await newOrder.save();
        return res.status(201).json({ message: 'Order created and validated.', order: newOrder });

    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//delete pallets for a specified order (soft delete) ✅
/////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////
//cancel an order✅ (mark as canceled)
/////////////////////////////////////////////////////////////

exports.cancelOrder= async (req , res) =>{
    try {
        const {order_id} = req.params;
        const order = await Order.findOne({order_id ,status : "Pending"});
        //check if the order exists                                    
        if(!order){
            return res.status(404).json({message : `the order ${order_id} not exists or already shipped `});
        }
        
        //check for assigned pallets
        for(const product of order.products){
            const {model,quantity,assignedPallets = []} = product;

            //1-check if there is assigned pallets
            if(assignedPallets.length > 0){
                await Pallet.updateMany(
                    {palette_id : {$in : assignedPallets}},
                    {$set : {deleted : false , ordered : false}}
                )
            }

            //2-check for not assigned pallets to mark them as not ordered
            const remainingToRestore = quantity - assignedPallets.length;
            
            if(remainingToRestore > 0){
                const unassignedOrderedPallets = await Pallet.find({
                    model,
                    ordered : true,
                    palette_id : {$nin : assignedPallets},
                    deleted : false
                }).limit(remainingToRestore);

                const restoreUnassignedOrderedPallets = unassignedOrderedPallets.map(p => p.palette_id);

                if(restoreUnassignedOrderedPallets.length > 0){
                    await Pallet.updateMany(
                        {palette_id : {$in :restoreUnassignedOrderedPallets }},
                        {$set : {ordered : false}}
                    )
                }

            }
        }

        //finnaly cancel the order
        order.status = "Canceled";
        await order.save();
        return res.status(200).json({message : `the order ${order_id} is deleted succefully`});
    
        
    }catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//get all orders✅
/////////////////////////////////////////////////////////////

exports.getAllOrders = async (req,res) =>{
    try {
        const allOrders = await Order.find({}); //get all orders

        if(allOrders === 0){ // not !order cause its an array 
            return res.status(404).json({message : `no orders found `})
        }
        return res.status(200).json({message : `found ${allOrders.length} ` ,allOrders})
    }catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//get order by id✅
/////////////////////////////////////////////////////////////

exports.getOrder = async (req,res) =>{
    try {
        const {order_id} =  req.params;
        const order = await Order.findOne({order_id});

        if(!order){ // not !order cause its an array
            return res.status(404).json({message : `no order found with the id ${order_id}`})
        }
        return res.status(200).json({order})
    }catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//get all pending orders ✅
/////////////////////////////////////////////////////////////

exports.getAllPending = async (req,res) =>{
    try {
        const getAll = await Order.find({status : "Pending"})
        return res.status(200).json(getAll);

    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//get all shipped orders ✅
/////////////////////////////////////////////////////////////

exports.getAllShipped = async (req,res) =>{
    try {
        const getAll = await Order.find({status : "Shipped"})
        return res.status(200).json(getAll);
        
    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

//get all canceled orders 
exports.getAllCanceled = async (req,res) =>{
    try {
        const getAll = await Order.find({status : "Canceled"})
        return res.status(200).json(getAll);
        
    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}


// /////////////////////////////////////////////////////////////
// //get shipping porgress of an order✅
// /////////////////////////////////////////////////////////////

// exports.getShippingProgress = async (req,res) =>{
//     try {
//         const {order_id} = req.params;

//         const findOrder = await Order.findOne({order_id});
//         if(findOrder.length === 0){
//             return res.status(404).json({message : "no order found"});
//         }

//         // Step 1: Flatten all assigned pallet IDs from all products
//         // const allAssignedPallets = findOrder.products.flatMap(product => product.assignedPallets);
        
//         const totalPallets =  findOrder.products.flatMap(p => p.assignedPallets)
//         const totalQuantity = findOrder.products.reduce((sum, product) => sum + parseInt(product.quantity), 0);
//         const deletdPallets = await Pallet.find({
//             palette_id : {$in: totalPallets},
//             deleted :true
//         })
        
//         const remainingPallets = await Pallet.find({
//             palette_id : {$in: totalPallets},
//             deleted :false
//         })

//         return res.status(200).json({
//             message : `progress : ${deletdPallets.length}/${totalQuantity} `
//         });
//     } catch (error) {
//         return res.status(500).json({message : "server error : ",error : error.message})
//     }
// }

/////////////////////////////////////////////////////////////
//get shipping porgress of an order✅
/////////////////////////////////////////////////////////////

exports.getShippingProgress = async (req,res) =>{
    try {
        const {order_id} = req.params;

        const findOrder = await Order.findOne({order_id});
        if(!findOrder){
            return res.status(404).json({message : "no order found"});
        }

        // Step 1: Flatten all assigned pallet IDs from all products
        // const allAssignedPallets = findOrder.products.flatMap(product => product.assignedPallets);
        const products = findOrder.products;

        const progress = [];

        for(const product of products ){
            const {model, quantity, assignedPallets} = product;
            
            const shippedCount = String(assignedPallets.length);
            const totalCount =  quantity;


        progress.push({
            model,
            progress : `${shippedCount}/${totalCount}`
        })
        }
        return res.status(200).json({
            message : `progress : `,progress
        });
        
    } catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//get available pallets for a model✅/////////////////////////////////////////////////////////////

exports.getAvailablePalleteModel = async (req,res) =>{
    try {
        const {model} = req.params;
        const allPallets = await Pallet.find({deleted : false, model : model})
        const taken = await Pallet.find({ordered : true, deleted : false , model : model})

        const total = allPallets.length - taken.length;
        
        if(total === 0){
            return res.status(404).json({message : `no pallets available for the model ${model}`})
        }
        return res.status(200).json({message : `available ${total} pallets for the model ${model}`})
    }catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

/////////////////////////////////////////////////////////////
//get orders which have pallets of a specified lot✅
/////////////////////////////////////////////////////////////

exports.getAssigned = async (req,res) =>{
    try {
        const {lot} = req.params;
        const allPallets = await Pallet.find({lot}); //get all pallets of the lot
        const palletsIDs = allPallets.map(p => p.palette_id);
        const orders = await Order.find({
            "products.assignedPallets" : {$in : palletsIDs}
        })


        if(orders.length === 0){ // not !order cause its an array
            return res.status(404).json({message : `no orders found `})
        }
        return res.status(200).json({message : `found ${orders.length} which have pallets of the lot ${lot}` ,orders})
    }catch (error) {
        return res.status(500).json({message : "server error : ",error : error.message})
    }
}

