const BASE = import.meta.env.BASE_URL;

export const partnersData = [
    // --- OFICIALES ---
    {
        name: "Medalla Bar",
        type: "Resto Bar",
        location: "Freyre, Córdoba",
        address: "Bv. 25 de Mayo 903",
        features: ["Gastronomía", "Cerveza Tirada", "Fábrica"],
        varieties: ["Golden", "Honey", "Red IPA", "Rock IPA", "Scottish", "Stout"],
        lat: -31.166778,
        lng: -62.101083,
        isOfficial: true,
        logo: `${BASE}logo_medalla.png`,
        phone: "+54 9 3564 661416",
        instagram: "@medallabrewing",
        facebook: "Medalla Brewing",
        web: "https://medallabrewing.com"
    },

    // --- ZONA SANTA FE ---
    {
        name: "Hotel SMS (Punto Medalla)",
        type: "Punto de Venta",
        location: "Suardi, Santa Fe",
        address: "Hotel SMS",
        features: ["Latas", "Barriles"],
        varieties: ["Consultar Stock"],
        lat: -30.5367,
        lng: -61.6967,
        logo: `${BASE}logo_sms.png`,
        phone: "+54 9 3562 123456",
        instagram: "@hotelsms",
        facebook: "Hotel SMS"
    },

    // --- ZONA CÓRDOBA ---
    {
        name: "Punto Medalla San Francisco",
        type: "Distribuidor",
        location: "San Francisco, Córdoba",
        address: "Contacto: 3564 336555",
        features: ["Alquiler Barriles", "Latas"],
        varieties: ["Todas las Variedades"],
        lat: -31.4279,
        lng: -62.0827,
        logo: `${BASE}logo_sf.png`,
        phone: "3564 336555",
        instagram: "@medalla.sf"
    },
    {
        name: "Punto Medalla Porteña",
        type: "Punto de Retiro",
        location: "Porteña, Córdoba",
        address: "Contacto: 3564 416471",
        features: ["Latas", "Barriles"],
        varieties: ["Pack Degustación"],
        lat: -31.0134,
        lng: -62.0658,
        logo: `${BASE}logo_portena.png`,
        phone: "3564 416471",
        instagram: "@medalla.portena"
    },
    {
        name: "Punto Medalla Brinkmann",
        type: "Punto de Retiro",
        location: "Brinkmann, Córdoba",
        address: "Contacto: 3562 523828",
        features: ["Latas", "Barriles"],
        varieties: ["Consultar Stock"],
        lat: -30.8653,
        lng: -62.0389,
        logo: `${BASE}logo_brinkmann.png`,
        phone: "3562 523828",
        instagram: "@medalla.brinkmann"
    },
    {
        name: "Punto Medalla Morteros",
        type: "Punto de Retiro",
        location: "Morteros, Córdoba",
        address: "Contacto: 3562 454991",
        features: ["Latas", "Barriles"],
        varieties: ["Consultar Stock"],
        lat: -30.7118,
        lng: -62.0033,
        logo: `${BASE}logo_morteros.png`,
        phone: "3562 454991",
        instagram: "@medalla.morteros"
    },
    {
        name: "Punto Medalla Devoto",
        type: "Punto de Retiro",
        location: "Devoto, Córdoba",
        address: "Zona Centro",
        features: ["Latas", "Barriles"],
        varieties: ["Consultar Stock"],
        lat: -31.4045,
        lng: -62.3046,
        logo: `${BASE}logo_devoto.png`,
        instagram: "@medalla.devoto"
    }
];
