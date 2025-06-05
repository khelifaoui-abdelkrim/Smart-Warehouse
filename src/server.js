require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const pallet_routes = require('./routes/paletteRoutes');
const user_routes = require('./routes/userRoutes');
const scanLog_routes = require('./routes/scanLogRoutes');
const model_routes = require('./routes/pallet_modelroutes');
const order_routes = require('./routes/orderRoutes');

const https = require('https');
const fs = require('fs'); //file system

app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000;


const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

// Connect to MongoDB
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log("MongoDB connected ✅")
    }
    catch(error){
        console.log("error occured ❌ :",error.message)
        process.exit(1)
    }
}
connectDB();

app.use('/pallets',pallet_routes); //  this means use all paletteRoutes.js with the prefix /pallets ex: /pallets/add
app.use('/pallets',scanLog_routes);
app.use('/users',user_routes);
app.use('/models',model_routes);
app.use('/orders',order_routes);


// Test route
app.get('/', (req, res) => {
    res.send("Smart Pallet System API is running...");
});

https.createServer(options, app).listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})

// app.listen(PORT,() => {
//     console.log(`Server running on port ${PORT}`);
// });
// app.listen(PORT,'0.0.0.0',() => {
//     console.log(`Server running on port ${PORT}`);
// });