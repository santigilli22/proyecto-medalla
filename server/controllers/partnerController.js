import Partner from '../models/Partner.js';

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({ isActive: true });
        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPartnersNear = async (req, res) => {
    const { lat, lng, dist } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: 'Latitude (lat) and Longitude (lng) are required.' });
    }

    try {
        // Distance in meters (default 50km if not specified, usually closer is better but let's be generous for rural areas)
        const distanceInMeters = (parseFloat(dist) || 50) * 1000;

        const partners = await Partner.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: distanceInMeters
                }
            },
            isActive: true
        });

        res.json(partners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
