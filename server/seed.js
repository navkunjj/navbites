const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Dish = require('./models/Dish');
require('dotenv').config();

// Sample dishes data to seed
const dishesData = [
    {
        title: "Truffle Wagyu Steak",
        description: "A5 Japanese Wagyu served with black truffle reduction and seasonal roasted vegetables.",
        price: 128,
        rating: 4.9,
        category: "Steakhouse",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Lobster Thermidor",
        description: "Fresh Atlantic lobster baked with creamy cognac sauce and gruyère cheese crust.",
        price: 95,
        rating: 4.8,
        category: "Seafood",
        image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Gold Leaf Risotto",
        description: "Saffron risotto topped with 24k edible gold leaf and parmigiano reggiano.",
        price: 75,
        rating: 4.7,
        category: "Italian",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Oysters Rockefeller",
        description: "Freshly shucked oysters baked with spinach, herbs, and a buttery breadcrumb topping.",
        price: 68,
        rating: 4.9,
        category: "Seafood",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Pan-Seared Scallops",
        description: "Jumbo sea scallops seared to perfection served with cauliflower purée and caviar.",
        price: 85,
        rating: 4.8,
        category: "Seafood",
        image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Midnight Chocolate Cake",
        description: "Decadent dark chocolate fondant with a molten core and vanilla bean gelato.",
        price: 45,
        rating: 5.0,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Premium Sushi Set",
        description: "Chef's selection of premium nigiri and sashimi flown in daily from Tsukiji Market.",
        price: 88,
        rating: 4.9,
        category: "Asian Fusion",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Herb-Crusted Lamb",
        description: "New Zealand lamb rack with mint pesto, fondant potatoes, and red wine jus.",
        price: 92,
        rating: 4.8,
        category: "Fine Dining",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Berry Pavlova",
        description: "Crisp meringue topped with whipped chantilly cream and fresh summer berries.",
        price: 35,
        rating: 4.7,
        category: "Desserts",
        image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Wild Mushroom Risotto",
        description: "Creamy arborio rice with foraged mushrooms, truffle oil, and vegan parmesan.",
        price: 65,
        rating: 4.6,
        category: "Vegan",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Tofu Pad Thai",
        description: "Rice noodles stir-fried with pressed tofu, bean sprouts, peanuts, and tamarind sauce.",
        price: 42,
        rating: 4.5,
        category: "Vegan",
        image: "https://images.unsplash.com/photo-1559311648-d46f4d8593d8?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Tom Yum Soup",
        description: "Spicy and sour Thai soup with lemongrass, galangal, kaffir lime leaves, and jumbo shrimp.",
        price: 38,
        rating: 4.8,
        category: "Asian Fusion",
        image: "https://images.unsplash.com/photo-1548943487-a2e4b43b4853?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Margherita Pizza",
        description: "San Marzano tomatoes, fresh buffalo mozzarella, basil, and extra virgin olive oil.",
        price: 55,
        rating: 4.7,
        category: "Italian",
        image: "https://images.unsplash.com/photo-1574129624542-467f9aa93374?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Ribeye Steak",
        description: "Dry-aged prime ribeye chargrilled to your liking, served with garlic herb butter.",
        price: 115,
        rating: 4.9,
        category: "Steakhouse",
        image: "https://images.unsplash.com/photo-1606416133972-4e78205e3394?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Caviar Platter",
        description: "Beluga caviar served with traditional accompaniments: blinis, crème fraîche, and chopped egg.",
        price: 250,
        rating: 5.0,
        category: "Fine Dining",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        // Create admin user
        const adminEmail = 'admin@navbites.com';
        let admin = await User.findOne({ email: adminEmail });
        
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);
            
            admin = new User({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                tokens: 10000
            });
            
            await admin.save();
            console.log('✅ Admin user created successfully');
            console.log('   Email: admin@navbites.com');
            console.log('   Password: Admin@123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Seed dishes
        const existingDishes = await Dish.countDocuments();
        if (existingDishes === 0) {
            await Dish.insertMany(dishesData);
            console.log(`✅ ${dishesData.length} dishes added to database`);
        } else {
            console.log(`ℹ️  Database already has ${existingDishes} dishes`);
        }

        console.log('\n🎉 Database seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
