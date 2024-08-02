const Cart = require('../models/cartModel');

exports.deleteProduct = async (userid, productid) => {
    const cart = await Cart.findOne({ user_id: userid });
    if (!cart) {
      return { status: 404, message: "Cart not found" };
    }
  
    if (cart.products && cart.products.length <= 1) {
      await Cart.findByIdAndDelete(cart._id);
      return { status: 200, message: "Cart deleted" };
    } else {
      const updatedProducts = cart.products.filter((prod) => prod.product_id != productid);
      cart.products = updatedProducts;
      await cart.save();
      return { status: 200, message: "Product deleted from cart", updatedProducts };
    }
  };

// exports.deleteCartItem = async (userid, productid) => {
//     try {
//         const cart = await Cart.findOne({ user_id: userid });
//         if (!cart) {
//             return { status: 404, message: "Cart not found" };
//         }

//         const updateCart = await Cart.findByIdAndUpdate(
//             cart._id,
//             { $pull: { products: { product_id: productid } } },
//             { new: true }
//         )

//         if (!updateCart) {
//             return { status: 404, message: "Product not found in cart" };
//         }
//         return { status: 200, data: updateCart };
//     } catch (error) {
//         console.error(error);
//         return { status: 500, message: error.message };
//     }
// };

// exports.deleteCartItem = async (userid, productid) => {
//     try {
//       const cart = await Cart.findOne({ user_id: userid });
//       if (!cart) {
//         return { status: 404, message: "Cart not found" };
//       }
  
//       const productIndex = cart.products.findIndex(p => p.product_id === productid);
//       if (productIndex === -1) {
//         return { status: 404, message: "Product not found in cart" };
//       }
  
//       const product = cart.products[productIndex];
//       product.quantity -= 1;
  
//       if (product.quantity < 1) {
//         cart.products.splice(productIndex, 1);
//       }
  
//       if (cart.products.length === 0) {
//         await Cart.findByIdAndDelete(cart._id);
//         return { status: 200, message: "Cart deleted" };
//       } else {
//         await Cart.findByIdAndUpdate(cart._id, { products: cart.products }, { new: true });
//         return { status: 200, data: cart };
//       }
//     } catch (error) {
//       console.error(error);
//       return { status: 500, message: error.message };
//     }
//   };