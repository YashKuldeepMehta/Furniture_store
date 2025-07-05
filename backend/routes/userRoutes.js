require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Product = require('../models/products');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart')
const auth = require('../middleware/auth')


router.get("/", (req, res) => {
    res.send("User route is working");
});

router.post("/signup", async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/categorywiseproducts', async (req, res) => {
    const { category } = req.body || {};
    if (!category) {
        return res.status(400).json({ error: "Category is required" });
    }
    try {
        const products = await Product.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found in this category" });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/addtocart', auth, async(req,res) =>{
    const {productId,quantity, name, price, image} = req.body;
    try{
        let cart = await Cart.findOne({userId : req.user.id});
        if(!cart){
            cart = new Cart({userId : req.user.id, items:[]})
        }
        const existingitems = cart.items.find((item) => item.productId.toString() === productId)
        if(existingitems){
            existingitems.quantity += quantity
        }else{
            cart.items.push({productId, quantity, name, price, image})
        }
        await cart.save();
        res.status(200).json({message:"Product added to cart"})
    }catch(error){
        res.status(500).json({error: "Server error"})
    }
})

router.post('/fetchcart', auth,async (req,res) =>{
    const userid = req.user.id
    try{
        const items = await Cart.findOne({userId : userid})
        res.status(200).json(items) 
    }
    catch(error){
        res.status(500).json({error:"Server error"})
    }
})

router.put('/updatecartquantity',auth,async(req,res) =>{
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Cart Updated" });

    }catch(error){
        res.status(500).json({error:"Server Error"})
    }
})

router.delete('/removeitem/:productId',auth,async(req,res) =>{
    const userId  = req.user.id
    const {productId} = req.params

    try{
        const cart = await Cart.findOne({userId})
        if(!cart){
            res.status(404).json({error:"No cart found"})
        }

        const itemExists  =  cart.items.some((i) => i.productId.toString() === productId)
        if(!itemExists){
            res.status(404).json({error:"Item not found in the cart"})
        }

        cart.items = cart.items.filter((i) => i.productId.toString() !== productId)
        await cart.save()
        res.status(200).json({message:"Itemm removed from cart"})
    }catch(error){
        res.status(500).json({error:"Server error"})
    }
})

module.exports = router;