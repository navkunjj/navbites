const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

const debugDishes = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        const dbName = mongoose.connection.name;
        console.log('--- DB INFO ---');
        console.log('Database Name:', dbName);
        console.log('Connection URI:', MONGO_URI);

        const dishes = await Dish.find({});
        console.log('\n--- DISHES IN DB (' + dishes.length + ') ---');
        dishes.forEach(d => {
            console.log(`[${d.isActive ? 'ACTIVE' : 'INACTIVE'}] ${d.title}: ${d.image}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugDishes();
