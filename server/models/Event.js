import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: String,
    location: {
        name: String, // "Medalla Bar"
        address: String,
        lat: Number,
        lng: Number
    },
    image: String, // URL or path
    calendarLink: String, // Google Calendar Link
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
