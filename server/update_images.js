const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

const updateImages = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        const updates = [
            { title: "Truffle Wagyu Steak", image: "/dishes/truffle-wagyu.png" },
            { title: "Lobster Thermidor", image: "/dishes/lobster.png" },
            { title: "Wild Mushroom Risotto", image: "/dishes/risotto.png" },
            { title: "Premium Sushi Set", image: "/dishes/sushi.png" },
            { title: "Midnight Chocolate Cake", image: "/dishes/midnight-cake.png" }
        ];

        for (const update of updates) {
            const res = await Dish.updateOne(
                { title: update.title },
                { $set: { image: update.image } }
            );
            if (res.modifiedCount > 0) {
                console.log(`✅ Updated image for ${update.title}`);
            } else {
                console.log(`⚠️  Could not find or update ${update.title}`);
            }
        }

        console.log('🎉 Image updates completed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating images:', err);
        process.exit(1);
    }
};

updateImages();
