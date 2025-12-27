const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://navbites-psi.vercel.app/', // later replace with your frontend URL
}));


// Database Connection
// Use local mongodb by default if no env provided
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));



// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/dishes', require('./routes/dishes'));
app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
