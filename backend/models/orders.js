const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String,
    phone: {type:String, length:10},
    address:{
        line1:String,
        line2:String,
        city:String,
        state:String,
        pincode:String
    },
    paymentMethod:{
        type:String,
        enum:["cod","card","upi"],
        required:true,
    },

    paymentDetails:{
        cardName:String,
        cardNumber:String,
        cvv:String,
        upiId:String
    },

    cartItems:[
        {
            productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', required: true},
                quantity: { type: Number, required: true, default: 1 },
                name : String,
                price: Number,
                image: String
        }
    ],

    totalamount:{
        type:Number,
        required:true
    },

    orderStatus:{
        type:String,
        enum:["pending","confirmed","shipped","delivered"],
        default:"pending"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Order = mongoose.model("Order",orderSchema)
module.exports = Order