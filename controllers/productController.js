const Product = require("../models/productModel");
const { v4: uuidv4 } = require('uuid');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    console.error(err);
  }
};

const postProducts = async (req, res) => {
  const {id, title, description, category, price, image, rating } = req.body;
  try {
    const newProduct = new Product({
      id:uuidv4(), 
      title, 
      description, 
      category, 
      price, 
      image, 
      rating
    });
    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating product" });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).send({ message: "Product not found" });
    res.send(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating product" });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ id: id });
    if (!deletedProduct) return res.status(404).send({ message: "Product not found" });
    res.send(deletedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting product" });
  }
}

module.exports = { getAllProducts, postProducts, updateProduct, deleteProduct };