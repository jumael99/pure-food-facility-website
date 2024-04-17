const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);