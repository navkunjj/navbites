const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery_db';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@navbites.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        let admin = await User.findOne({ email });

        if (admin) {
            admin.password = hashedPassword;
            admin.role = 'admin';
            admin.isActive = true;
            await admin.save();
            console.log('✅ Admin password reset to: admin123');
        } else {
            admin = new User({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
                tokens: 9999
            });
            await admin.save();
            console.log('✅ Admin user created with password: admin123');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting admin:', err);
        process.exit(1);
    }
};

resetAdmin();
