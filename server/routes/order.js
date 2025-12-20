const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');

// @route   POST api/orders
// @desc    Create an order
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { items, totalTokens, address, phone } = req.body;

        const user = await User.findById(req.user.id);
        
        if (user.tokens < totalTokens) {
            return res.status(400).json({ msg: 'Insufficient tokens' });
        }

        // Create Order
        const newOrder = new Order({
            user: req.user.id,
            items,
            totalTokens,
            address,
            phone
        });

        await newOrder.save();

        // Deduct Tokens
        user.tokens -= totalTokens;
        await user.save();

        // Clear Cart
        await Cart.findOneAndDelete({ user: req.user.id });

        res.json({ order: newOrder, tokens: user.tokens });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
