const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

const listDishes = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        
        const allDishes = await Dish.find({});
        console.log("--- DISH LIST WITH IMAGES ---");
        allDishes.forEach(d => console.log(`${d.title}: ${d.image}`));
        console.log("-----------------");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listDishes();
