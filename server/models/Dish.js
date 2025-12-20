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
        enum: ['All', 'Fine Dining', 'Steakhouse', 'Seafood', 'Desserts', 'Vegan', 'Asian Fusion', 'Italian'],
    },
    image: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
DishSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Dish', DishSchema);
