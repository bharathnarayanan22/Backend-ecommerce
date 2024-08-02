const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const Productroutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const CartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoute');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb+srv://Bharath_Narayanan:bharath22@cluster0.16bef1g.mongodb.net/ecommerce'
).then(()=>{
    console.log("Connected to MongoDB");
});

app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(express.json());
app.use(cors());

app.use('/', Productroutes);
app.use('/users', userRoutes);
app.use('/cart', CartRoutes);
app.use('/order', orderRoutes);

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});
