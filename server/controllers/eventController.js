import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
    try {
        // Public: Fetch upcoming events
        const today = new Date();
        // Reset time to start of day to include events specifically today
        today.setHours(0, 0, 0, 0);

        const events = await Event.find({
            date: { $gte: today },
            isActive: true
        }).sort({ date: 1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        // Admin: Fetch all events (including past and inactive)
        const events = await Event.find({}).sort({ date: -1 });  // Newest first
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createEvent = async (req, res) => {
    const event = new Event(req.body);
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
