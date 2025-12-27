const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// @route   GET api/dishes
// @desc    Get all active dishes (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(dishes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
