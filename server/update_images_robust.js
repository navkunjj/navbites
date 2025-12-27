const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

const updateImages = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        
        const allDishes = await Dish.find({});
        console.log(`Found ${allDishes.length} dishes in DB.`);

        const updates = [
            { search: "Wagyu", image: "/dishes/truffle-wagyu.png" },
            { search: "Lobster", image: "/dishes/lobster.png" },
            { search: "Risotto", image: "/dishes/risotto.png" },
            { search: "Sushi", image: "/dishes/sushi.png" },
            { search: "Cake", image: "/dishes/midnight-cake.png" }
        ];

        for (const up of updates) {
            const found = allDishes.find(d => d.title.includes(up.search));
            if (found) {
                await Dish.updateOne({ _id: found._id }, { $set: { image: up.image } });
                console.log(`✅ Updated "${found.title}" with image ${up.image}`);
            } else {
                console.log(`❌ Could not find dish containing "${up.search}"`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
