import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Upsert admin user
        await User.findOneAndUpdate(
            { username: 'admin' },
            {
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        console.log('Admin user created/updated: admin / admin123');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
