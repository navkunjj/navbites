const mongoose = require('mongoose');
const User = require('./models/User');
const Dish = require('./models/Dish');
require('dotenv').config();

const indianDishes = [
    {
        title: "Chicken Momos",
        description: "Steamed Himalayan dumplings filled with spiced minced chicken, served with spicy sesame chutney.",
        price: 35,
        rating: 4.8,
        category: "Appetizers",
        image: "/dishes/chicken_momos.png"
    },
    {
        title: "Paneer Tikka Pizza",
        description: "Fusion wood-fired pizza topped with marinated paneer tikka, onions, capsicum, and mozzarella.",
        price: 55,
        rating: 4.7,
        category: "Fusion",
        image: "/dishes/paneer_tikka_pizza.png"
    },
    {
        title: "Hyderabadi Dum Biryani",
        description: "Aromatic basmati rice slow-cooked with tender marinated chicken, saffron, and whole spices.",
        price: 65,
        rating: 4.9,
        category: "Rice & Biryani",
        image: "/dishes/hyderabadi_biryani.png"
    },
    {
        title: "Butter Chicken",
        description: "Tender chicken pieces simmered in a rich, creamy tomato and cashew gravy with fenugreek.",
        price: 58,
        rating: 4.9,
        category: "Curries",
        image: "/dishes/butter_chicken.png"
    },
    {
        title: "Pani Puri Platter",
        description: "Crispy hollow puris served with spicy mint water, tamarind chutney, and potato-chickpea filling.",
        price: 25,
        rating: 4.8,
        category: "Street Food",
        image: "/dishes/pani-puri-platter.png"
    },
    {
        title: "Masala Dosa",
        description: "Crispy fermented rice crepe filled with spiced potato mash, served with sambar and coconut chutney.",
        price: 40,
        rating: 4.7,
        category: "South Indian",
        image: "/dishes/masala-dosa.png"
    },
    {
        title: "Gulab Jamun",
        description: "Warm milk-solid fried dumplings soaked in rose-scented sugar syrup, garnished with pistachios.",
        price: 28,
        rating: 4.9,
        category: "Desserts",
        image: "/dishes/gulab-jamun.png"
    },
    {
        title: "Vegetable Samosa",
        description: "Crispy pastry pockets filled with spiced potatoes and peas, served with mint chutney.",
        price: 18,
        rating: 4.6,
        category: "Appetizers",
        image: "/dishes/vegetable-samosa.png"
    },
    {
        title: "Tandoori Lamb Chops",
        description: "Juicy lamb chops marinated in yogurt and spices, char-grilled in a clay oven.",
        price: 85,
        rating: 5.0,
        category: "Tandoor",
        image: "/dishes/tandoori-lamb-chops.png"
    },
    {
        title: "Mango Lassi",
        description: "Refreshing yogurt-based drink blended with sweet alphonso mango pulp and cardamom.",
        price: 20,
        rating: 4.8,
        category: "Beverages",
        image: "/dishes/mango-lassi.jpg"
    }
];

const seedMenu = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing dishes
        await Dish.deleteMany({});
        console.log('🗑️  Cleared existing dishes');

        // Insert new dishes
        await Dish.insertMany(indianDishes);
        console.log(`✅ Added ${indianDishes.length} dishes to the menu.`);

        // Check/Seed Admin User (Optional but useful for a full reset)
        const adminEmail = 'admin@navbites.com';
        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            console.log('ℹ️  Admin user already exists');
        } else {
            console.log('⚠️  Admin user not found. You may need to run reset_admin.js if login fails.');
        }

        console.log('\n🎉 Menu successfully seeded!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seedMenu();
