const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name, 
            email, 
            password: hashedPassword
        });

        await user.save();

        // Create Token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        tokens: user.tokens,
                        role: user.role
                    } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   GET api/auth/me
// @desc    Get user data and update tokens
// @access  Private
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Token growth logic: 10 tokens per hour
        const now = new Date();
        const diffMs = now - user.lastTokenUpdate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours > 0) {
            user.tokens += diffHours * 10;
            user.lastTokenUpdate = now;
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create Token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'secret123', 
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        tokens: user.tokens,
                        role: user.role
                    } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/topup
// @desc    Add tokens to user account (Simulation)
// @access  Private
router.post('/topup', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.tokens += amount || 100;
        await user.save();
        res.json({ tokens: user.tokens });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
