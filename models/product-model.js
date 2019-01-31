const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: String,
    productDescription: String,
    productPrice: Number,
    productRentPrice: Number,
    productQuantity: Number,
    category: String,
    thumbnail: [String]
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
