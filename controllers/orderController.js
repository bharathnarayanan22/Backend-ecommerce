const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

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

        const products = cart.products.map((product) => {
            return {
                product_id: product.product_id,
                quantity: product.quantity,
            };
        });

        const subtotal = await Promise.all(products.map(async (product) => {
            const productInfo = await Product.findOne({ id: product.product_id });
            if (!productInfo) {
                return null;
            }
            return productInfo.price * product.quantity;
        }));

        const totalAmount = subtotal.reduce((acc, amount) => acc + amount, 0);

        const order = new Order({
            id: uuidv4(),
            user_id,
            user_email: email,
            cust_Name,
            cust_Address,
            cust_PhNO: cust_PhNo,
            products,
            totalAmount, 
            orderDate: new Date(),
            est_DeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        });

        await order.save();

        await Cart.findOneAndDelete({ user_id });

        res.status(201).send(order);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getOrders = async(req, res) => {
    const user_id = req.user;
    try {
        const orders = await Order.find({ user_id });
        const ordersWithProductDetails = await Promise.all(orders.map(async (order) => {
            const productsWithDetails = await Promise.all(order.products.map(async (product) => {
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
            return {
                Orderid: order.id,
                products: productsWithDetails,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                est_DeliveryDate: order.est_DeliveryDate,
                Status: order.orderStatus 
            };
        }));
        res.send(ordersWithProductDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = { createOrder, getOrders };