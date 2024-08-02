const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');

const createOrder = async (req, res) => {
    const user_id = req.user;
    const { cust_Name, cust_Address, cust_PhNo } = req.body;

    try {
        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        const user = await User.findById(user_id);
        const { email } = user;

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
        const subtotal = productDetails.reduce((acc, product) => {
            return acc + (product.price * product.quantity);
        }, 0);

        const order = new Order({
            user_id,
            user_email: email,
            cust_Name,
            cust_Address,
            cust_PhNO: cust_PhNo,
            products: productDetails,
            totalAmount: subtotal,
            orderDate: new Date(),
            est_DeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Estimated delivery date (7 days from now)
        });


        await order.save();
        for (const product of cart.products) {
            const { productId, quantity } = product;
            await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } }, { new: true });
        }

        await Cart.findOneAndDelete({ user_id });

        res.status(201).send(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


module.exports = { createOrder };