const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentSchema = new Schema({
    productName: String,
    productRentPrice: Number,
    rentQuantity: Number,
    category: String,
    productID: String,
    user: {
    	id: String,
    	name: String,
    	username: String
    },
    rentTotal: Number,
    startDate: Date,
    endDate: Date,
    totalDays: Number,
    requestTime: {type: Date, default: Date.now },
    status: String
});

const Rent = mongoose.model('rent', rentSchema);

module.exports = Rent;
