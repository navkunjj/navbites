const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

const updateImages = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        
        const updates = [
            { title: "Chicken Momos", image: "/dishes/chicken-momos.png" },
            { title: "Paneer Tikka Pizza", image: "/dishes/paneer-tikka-pizza.png" },
            { title: "Hyderabadi Dum Biryani", image: "/dishes/hyderabadi-dum-biryani.png" },
            { title: "Butter Chicken", image: "/dishes/butter-chicken.png" },
            { title: "Pani Puri Platter", image: "/dishes/pani-puri-platter.png" },
            { title: "Masala Dosa", image: "/dishes/masala-dosa.png" },
            { title: "Gulab Jamun", image: "/dishes/gulab-jamun.png" },
            { title: "Vegetable Samosa", image: "/dishes/vegetable-samosa.png" },
            { title: "Tandoori Lamb Chops", image: "/dishes/tandoori-lamb-chops.png" },
            { title: "Mango Lassi", image: "/dishes/mango-lassi.png" }
        ];

        for (const up of updates) {
            const result = await Dish.updateOne({ title: up.title }, { $set: { image: up.image } });
            if (result.matchedCount > 0) {
                console.log(`✅ Updated "${up.title}" to ${up.image}`);
            } else {
                console.log(`❌ Could not find "${up.title}"`);
            }
        }

        console.log('Update complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
