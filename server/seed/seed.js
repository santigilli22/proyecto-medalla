import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Partner from '../models/Partner.js';
import Beer from '../models/Beer.js';
import Event from '../models/Event.js';
import { partnersData, beersData, eventsData } from './data.js';

dotenv.config();

const seedDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI not defined in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // Clear existing data? Maybe better to upsert or just clear for dev.
        // For safe migration, we'll clear for now since this is initial setup.
        await Partner.deleteMany({});
        await Beer.deleteMany({});
        console.log('Cleared existing data.');

        // Transform and Insert Partners
        const partners = partnersData.map(p => {
            // Split location "City, Province" roughly
            const parts = p.location ? p.location.split(',') : ["", ""];
            const city = parts[0].trim();
            const province = parts[1] ? parts[1].trim() : "";

            return {
                name: p.name,
                type: p.type,
                location: {
                    type: 'Point',
                    coordinates: [p.lng, p.lat]
                },
                locationDetails: {
                    address: p.address,
                    city: city,
                    province: province,
                    region: "" // Manual fill later if needed logic
                },
                contact: {
                    phone: p.phone,
                    instagram: p.instagram,
                    website: p.facebook, // mapping facebook to website/social
                    mail: p.mail
                },
                features: p.features,
                varieties: p.varieties,
                isOfficial: p.isOfficial,
                logo: p.logo,
                isActive: true
            };
        });

        await Partner.insertMany(partners);
        console.log(`Seeded ${partners.length} partners.`);

        // Transform and Insert Beers
        const beers = beersData.map(b => ({
            id: b.id,
            name: b.name,
            titleImg: b.titleImg,
            persona: b.persona,
            category: b.category,
            style: b.style,
            specs: {
                abv: b.abv,
                ibu: b.ibu,
                srm: b.srm
            },
            color: b.color,
            images: {
                main: b.img,
                detail: b.detailImg
            },
            tags: b.tags
        }));

        await Beer.insertMany(beers);
        console.log(`Seeded ${beers.length} beers.`);

        // Transform and Insert Events
        await Event.deleteMany({});
        const events = eventsData.map(e => ({
            title: e.title,
            date: new Date(e.date),
            description: e.description,
            location: {
                name: e.locationName
            },
            calendarLink: e.link
        }));
        await Event.insertMany(events);
        console.log(`Seeded ${events.length} events.`);

        mongoose.connection.close();
        console.log('Done!');
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
