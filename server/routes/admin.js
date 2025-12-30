const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');
const User = require('../models/User');
const Dish = require('../models/Dish');
const multer = require('multer');
const path = require('path');

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed!'));
    }
});


// @route   GET api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDishes = await Dish.countDocuments({ isActive: true });

        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalTokens, 0);

        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ date: -1 })
            .limit(5);

        res.json({
            totalOrders,
            totalUsers,
            totalDishes,
            totalRevenue,
            recentOrders
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   GET api/admin/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email tokens')
            .sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   PUT api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(req.params.id)
            .populate('user', 'name email');

        res.json(updatedOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   DELETE api/admin/orders/:id
// @desc    Delete/Cancel order
// @access  Private (Admin)
router.delete('/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Refund tokens to user
        const user = await User.findById(order.user);
        if (user) {
            user.tokens += order.totalTokens;
            await user.save();
        }

        await Order.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Order cancelled and tokens refunded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   GET api/admin/users/:id
// @desc    Get user details with order history
// @access  Private (Admin)
router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const orders = await Order.find({ user: req.params.id }).sort({ date: -1 });

        res.json({ user, orders });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   PUT api/admin/users/:id
// @desc    Update user details
// @access  Private (Admin)
router.put('/users/:id', adminAuth, async (req, res) => {
    try {
        const { name, email, tokens, isActive } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (tokens !== undefined) user.tokens = tokens;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        const updatedUser = await User.findById(req.params.id).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Deactivate user
// @access  Private (Admin)
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.json({ msg: 'User deactivated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   GET api/admin/dishes
// @desc    Get all dishes
// @access  Private (Admin)
router.get('/dishes', adminAuth, async (req, res) => {
    try {
        const dishes = await Dish.find().sort({ createdAt: -1 });
        res.json(dishes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   POST api/admin/dishes
// @desc    Create new dish
// @access  Private (Admin)
router.post('/dishes', adminAuth, async (req, res) => {
    try {
        const { title, description, price, rating, category, image } = req.body;

        const newDish = new Dish({
            title,
            description,
            price,
            rating: rating || 4.5,
            category,
            image
        });

        await newDish.save();
        res.json(newDish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   PUT api/admin/dishes/:id
// @desc    Update dish
// @access  Private (Admin)
router.put('/dishes/:id', adminAuth, async (req, res) => {
    try {
        const { title, description, price, rating, category, image, isActive } = req.body;

        const dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({ msg: 'Dish not found' });
        }

        if (title) dish.title = title;
        if (description) dish.description = description;
        if (price) dish.price = price;
        if (rating) dish.rating = rating;
        if (category) dish.category = category;
        if (image) dish.image = image;
        if (isActive !== undefined) dish.isActive = isActive;

        await dish.save();
        res.json(dish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   DELETE api/admin/dishes/:id
// @desc    Delete dish
// @access  Private (Admin)
router.delete('/dishes/:id', adminAuth, async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({ msg: 'Dish not found' });
        }

        await Dish.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Dish deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   POST api/admin/dishes/upload
// @desc    Upload dish image
// @access  Private (Admin)
router.post('/dishes/upload', adminAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload a file' });
        }
        res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

module.exports = router;
