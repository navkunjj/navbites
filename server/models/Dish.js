const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5,
    },
    category: {
        type: String,
        required: true,
        enum: ['All', 'Appetizers', 'Curries', 'Rice & Biryani', 'Street Food', 'Tandoor', 'South Indian', 'Fusion', 'Desserts', 'Beverages'],
    },
    image: {
        type: String,
        default: '/dishes/default_dish.png',
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Dish', DishSchema);
