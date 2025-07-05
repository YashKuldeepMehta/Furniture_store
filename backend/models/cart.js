const mongoose = require('mongoose');

const cartItemsSchema = new mongoose.Schema({
    productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', required: true},
    quantity: { type: Number, required: true, default: 1 },
    name : String,
    price: Number,
    image: String 
})

const cartSchema  = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemsSchema],
})

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;