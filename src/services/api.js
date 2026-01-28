const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getPartners = async () => {
    try {
        const res = await fetch(`${API_URL}/partners`);
        if (!res.ok) throw new Error('Failed to fetch partners');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getPartnersNear = async (lat, lng, dist = 50) => {
    try {
        const res = await fetch(`${API_URL}/partners/near?lat=${lat}&lng=${lng}&dist=${dist}`);
        if (!res.ok) throw new Error('Failed to fetch nearby partners');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getBeers = async () => {
    try {
        const res = await fetch(`${API_URL}/beers`);
        if (!res.ok) throw new Error('Failed to fetch beers');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const recommendBeer = async (preferences) => {
    try {
        const res = await fetch(`${API_URL}/sommelier/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences),
        });
        if (!res.ok) throw new Error('Failed to get recommendation');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getBeerById = async (id) => {
    try {
        const res = await fetch(`${API_URL}/beers/${id}`);
        if (!res.ok) throw new Error('Failed to fetch beer');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null; // Or handle as you wish
    }
};

export const getEvents = async () => {
    try {
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};
