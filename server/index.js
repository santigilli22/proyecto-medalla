import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import partnersRoutes from './routes/partners.js';
import beersRoutes from './routes/beers.js';
import sommelierRoutes from './routes/sommelier.js';
import eventsRoutes from './routes/events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/partners', partnersRoutes);
app.use('/api/beers', beersRoutes);
app.use('/api/sommelier', sommelierRoutes);
app.use('/api/events', eventsRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Medalla API is running' });
});

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.log('MONGODB_URI not found in .env, skipping database connection');
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
