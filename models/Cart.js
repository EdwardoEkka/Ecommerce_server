const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: String,
    username: String,
    productId: String
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
