import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Partner from '../models/Partner.js';
import Beer from '../models/Beer.js';
import Event from '../models/Event.js';
import Keg from '../models/Keg.js';
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

        // Transform and Insert Kegs
        // We import kegsData dynamically or just copy the structure here since it's static in the frontend file
        // For simplicity, let's just define the initial data here based on what we saw in the file, 
        // OR better yet, let's update the import at the top to import kegsData if possible.
        // Since kegsData.js has 'export const kegsData', we can import it.
        // NOTE: The previous view of seed.js didn't show importing kegsData.
        // I will add the import in a separate replace call or just hardcode the initial data here.
        // Let's hardcode for stability as the frontend file uses import.meta.env which might fail in Node context without tweaking.

        await Keg.deleteMany({});
        const kegs = [
            {
                size: "10 Litros",
                serves: "~20 Pintas",
                ideal: "Pequeñas Reuniones",
                price: "Consultar",
                iconSize: 48,
                stock: 100,
                img: "assets/img/kegs/keg_10l_celebration.webp",
                description: "Ideal para una cena con amigos cercanos o una previa antes de salir. La medida justa para disfrutar de una buena cerveza tirada sin excesos."
            },
            {
                size: "20 Litros",
                serves: "~40 Pintas",
                ideal: "Cumpleaños y Asados",
                price: "Consultar",
                iconSize: 56,
                stock: 50,
                img: "assets/img/kegs/keg_20l_celebration.webp",
                description: "El clásico de los fines de semana. Perfecto para cumpleaños en casa, asados familiares o esas juntadas que se extienden hasta tarde."
            },
            {
                size: "30 Litros",
                serves: "~60 Pintas",
                ideal: "Eventos Medianos",
                price: "Consultar",
                iconSize: 60,
                stock: 35,
                img: "assets/img/kegs/keg_30l_celebration.webp",
                description: "Cuando la convocatoria supera lo habitual. Excelente para despedidas, recibidas o reuniones donde la sed es protagonista y nadie quiere quedarse corto."
            },
            {
                size: "50 Litros",
                serves: "~100 Pintas",
                ideal: "Grandes Eventos",
                price: "Consultar",
                iconSize: 64,
                stock: 20,
                img: "assets/img/kegs/keg_50l_celebration.webp",
                description: "Pensado para casamientos, fiestas corporativas o festivales. La solución definitiva para abastecer a una multitud y asegurar el éxito del evento."
            }
        ];
        await Keg.insertMany(kegs);
        console.log(`Seeded ${kegs.length} kegs.`);

        mongoose.connection.close();
        console.log('Done!');
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
