const express = require('express');
const Router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

Router.get('/products', auth, productController.getAllProducts);
Router.post('/products', auth, productController.postProducts);
Router.put('/products/:id', auth, productController.updateProduct);
Router.delete('/products/:id', auth, productController.deleteProduct);

module.exports = Router;