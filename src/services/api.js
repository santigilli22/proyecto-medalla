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

export const login = async (username, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Login failed');
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Helper for Auth Header
const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const getAllEventsAdmin = async () => {
    const res = await fetch(`${API_URL}/events/all`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
};

export const createEvent = async (eventData) => {
    const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to create event');
    return res.json();
};

export const updateEvent = async (id, eventData) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to update event');
    return res.json();
};

export const deleteEvent = async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to delete event');
    return res.json();
};

// Partners Admin
export const getAllPartnersAdmin = async () => {
    const res = await fetch(`${API_URL}/partners/all`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch partners');
    return res.json();
};

export const createPartner = async (data) => {
    const res = await fetch(`${API_URL}/partners`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create partner');
    return res.json();
};

export const updatePartner = async (id, data) => {
    const res = await fetch(`${API_URL}/partners/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update partner');
    return res.json();
};

export const deletePartner = async (id) => {
    const res = await fetch(`${API_URL}/partners/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to delete partner');
    return res.json();
};

// Beers Admin
export const createBeer = async (data) => {
    const res = await fetch(`${API_URL}/beers`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create beer');
    return res.json();
};

export const updateBeer = async (id, data) => {
    const res = await fetch(`${API_URL}/beers/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update beer');
    return res.json();
};

export const deleteBeer = async (id) => {
    // Note: Beers use legacy integer ID in controller: { id: req.params.id }
    // Ensure frontend passes the numeric ID.
    const res = await fetch(`${API_URL}/beers/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to delete beer');
    return res.json();
};

// Kegs Admin
export const getKegs = async () => {
    try {
        const res = await fetch(`${API_URL}/kegs`);
        if (!res.ok) throw new Error('Failed to fetch kegs');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createKeg = async (data) => {
    const res = await fetch(`${API_URL}/kegs`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create keg');
    return res.json();
};

export const updateKeg = async (id, data) => {
    const res = await fetch(`${API_URL}/kegs/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update keg');
    return res.json();
};

export const deleteKeg = async (id) => {
    const res = await fetch(`${API_URL}/kegs/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to delete keg');
    return res.json();
};

// Rentals (Stock Control)
export const getRentals = async () => {
    try {
        const res = await fetch(`${API_URL}/rentals`, { headers: authHeader() });
        if (!res.ok) throw new Error('Failed to fetch rentals');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createRental = async (data) => {
    const res = await fetch(`${API_URL}/rentals`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create rental');
    }
    return res.json();
};

export const updateRental = async (id, data) => {
    const res = await fetch(`${API_URL}/rentals/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update rental');
    return res.json();
};



export const deleteRental = async (id) => {
    const res = await fetch(`${API_URL}/rentals/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to delete rental');
    return res.json();
};

// Customers (CRM)
export const getCustomers = async () => {
    try {
        const res = await fetch(`${API_URL}/customers`, { headers: authHeader() });
        if (!res.ok) throw new Error('Failed to fetch customers');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createCustomer = async (data) => {
    const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
};

export const updateCustomer = async (id, data) => {
    const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
};

export const deleteCustomer = async (id) => {
    const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to delete customer');
    return res.json();
};

export const getCustomerHistory = async (id) => {
    try {
        const res = await fetch(`${API_URL}/customers/${id}/history`, { headers: authHeader() });
        if (!res.ok) throw new Error('Failed to fetch customer history');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Analytics
export const getAnalyticsKPI = async () => {
    const res = await fetch(`${API_URL}/analytics/dashboard`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
};

export const getAnalyticsSales = async () => {
    const res = await fetch(`${API_URL}/analytics/sales`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch sales data');
    return res.json();
};

export const getAnalyticsProducts = async () => {
    const res = await fetch(`${API_URL}/analytics/products`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch product data');
    return res.json();
};

export const getPaymentStats = async () => {
    const res = await fetch(`${API_URL}/analytics/payment-methods`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch payment data');
    return res.json();
};

export const getTopCustomers = async () => {
    const res = await fetch(`${API_URL}/analytics/top-customers`, { headers: authHeader() });
    if (!res.ok) throw new Error('Failed to fetch top customers');
    return res.json();
};
