import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, // Primary identifier
    email: String,
    address: String,
    totalRentals: { type: Number, default: 0 },
    lastRentalDate: Date,
    notes: String
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);
