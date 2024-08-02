const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const cartServices = require('../services/cartServices')

const addToCart = async (req, res) => {
    const user_id = req.user; 
    const { products } = req.body; 

    try {
        let cart = await Cart.findOne({ user_id });
        if (!cart) {
            cart = new Cart({ user_id, products });
            await cart.save();
            return res.status(201).send(cart);
        }

        for (const product of products) {
            const { product_id, quantity } = product;
            const productExists = cart.products.find(p => p.product_id === product_id);

            if (productExists) {
                productExists.quantity = quantity;
            } else {
                cart.products.push({ product_id, quantity });
            }
        }

        await cart.save();
        return res.send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


const getCartItems = async (req, res) => {
    const user_id = req.user; 
    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const productDetails = await Promise.all(cart.products.map(async (product) => {
            const productInfo = await Product.findOne({ id: product.product_id });
            if (!productInfo) {
                return null; 
            }
            return {
                product_id: product.product_id,
                quantity: product.quantity,
                title: productInfo.title,
                description: productInfo.description,
                image: productInfo.image,
                price: productInfo.price
            };
        }));

        // const filteredProductDetails = productDetails.filter(details => details !== null);

        const subtotal = productDetails.reduce((acc, product) => {
            return acc + (product.price * product.quantity);
        }, 0);

        res.send({
            products: productDetails,
            subtotal: subtotal
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// const deleteCartItem = async (req, res) => {
//     const result = await cartServices.deleteCartItem(req.user, req.body.product_id);
//     res.send(result);
// }

const deleteProduct = async (req, res) => {
    const result = await cartServices.deleteProduct(req.user, req.body.product_id);
    res.send(result);
}


// const deleteCart = async (req, res) => {
//     const user_id = req.user; 
//     try {
//         const cart = await Cart.findOneAndDelete({ user_id });
//         if (!cart) {
//             return res.status(404).send({ message: "Cart not found" });
//         }
//         res.send(cart);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error.message);
//     }
//  };

 



module.exports = { addToCart, getCartItems, deleteProduct };
