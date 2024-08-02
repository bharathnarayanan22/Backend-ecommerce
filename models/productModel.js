const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id:{
        type : String,
        unique: true,
    },
    title:{
        type : String,
        required : [true, "Title is Required"],
    },
    description:{
        type : String,
        required : [true, "Description is Required"],
    },
    category:{
        type : String,
    },
    price:{
        type : Number,
        required : [true, "Price is Required"],
    },
    image:{
        type : String,
    },
    rating:{
        rate:{
            type : Number,
        },
        count:{
            type : Number,
        }
    }
});

const Product = mongoose.model('products',productSchema);

module.exports = Product;