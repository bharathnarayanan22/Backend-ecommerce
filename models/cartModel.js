const mongoose = require('mongoose');

const cart = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    products: [{
        product_id: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }]
})

const Cart = mongoose.model('carts', cart);
module.exports = Cart;