const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    email: String,
    name: String,
    password: String,
    thumbnail: String,
    role: String,
    loginType: String,
    cart: [String],
    order: [String]
});

const User = mongoose.model('user', userSchema);

module.exports = User;