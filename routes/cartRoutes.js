const express = require('express');
const Router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

Router.post('/addToCart', auth, cartController.addToCart);
Router.get('/getCartItems', auth, cartController.getCartItems);
// Router.delete('/deleteCartItem', auth, cartController.deleteCartItem);
// Router.delete('/deleteCart', auth, cartController.deleteCart);
Router.delete('/deleteProduct', auth, cartController.deleteProduct);

module.exports = Router;