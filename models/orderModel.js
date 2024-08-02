const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    cust_Name: {
        type: String,
        required: true
    },
    cust_Address: {
        type: String,
        required: true
    },
    cust_PhNO: {
        type: String,
        required: true
    },
    products: [{
        product_id: {
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    totalAmount: {
        type: Number,
        // required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    est_DeliveryDate: {
        type: Date,
        required: true
    },
    orderStatus: {
        type: String,
        default: "Pending"
    }
})

const Order = mongoose.model('orders', orderSchema);
module.exports = Order;