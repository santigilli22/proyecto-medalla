import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
    try {
        // Fetch upcoming events, sorted by date
        const today = new Date();
        const events = await Event.find({
            date: { $gte: today },
            isActive: true
        }).sort({ date: 1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
