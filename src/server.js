require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const pallet_routes = require('./routes/paletteRoutes');
const user_routes = require('./routes/userRoutes');
const scanLog_routes = require('./routes/scanLogRoutes');
const model_routes = require('./routes/pallet_modelroutes');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

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

// Test route
app.get('/', (req, res) => {
    res.send("Smart Pallet System API is running...");
});


app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});
// app.listen(PORT,'0.0.0.0',() => {
//     console.log(`Server running on port ${PORT}`);
// });