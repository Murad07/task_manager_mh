require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);

    const users = [
        {
            name: 'Admin User',
            email: 'admin@demo.com',
            password: '123456',
            role: 'admin',
        },
        {
            name: 'Normal User',
            email: 'user@demo.com',
            password: '123456',
            role: 'user',
        },
    ]


    for (const userData of users) {
        const existing = await User.findOne({ email: userData.email });
        if (!existing) {
            const user = new User(userData);
            await user.save();
            console.log(`Seeded user: ${user.email}`);
        } else {
            console.log(`User already exists: ${userData.email}`);
        }
    }

    mongoose.disconnect();
}

seed();
