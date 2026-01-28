export const beersData = [
    { id: 1, name: "GOLDEN", titleImg: "assets/img/beers/webp/golden.webp", persona: "AMELIA", category: "Rubias", style: "Golden Ale", abv: "4.5%", ibu: 14, srm: 5, color: "bg-yellow-500", img: "assets/img/beers/webp/lata_golden.webp", detailImg: "assets/img/beers/webp/info_golden.webp", tags: ["Refrescante", "Suave", "Balanceada"] },
    { id: 2, name: "HONEY", titleImg: "assets/img/beers/webp/honey.webp", persona: "MARY", category: "Rubias", style: "Honey Beer", abv: "5.5%", ibu: 12, srm: 7, color: "bg-orange-500", img: "assets/img/beers/webp/lata_honey.webp", detailImg: "assets/img/beers/webp/info_honey.webp", tags: ["Dulce", "Miel Orgánica", "Suave"] },
    { id: 3, name: "RED IPA", titleImg: "assets/img/beers/webp/red_ipa.webp", persona: "VALENTINA", category: "IPAs", style: "Red India Pale Ale", abv: "6.0%", ibu: 48, srm: 14, color: "bg-red-600", img: "assets/img/beers/webp/lata_red_ipa.webp", detailImg: "assets/img/beers/webp/info_red_ipa.webp", tags: ["Amarga", "Frutal", "Caramelo"] },
    { id: 4, name: "ROCK IPA", titleImg: "assets/img/beers/webp/rock_ipa.webp", persona: "MARÍA TERESA", category: "IPAs", style: "American IPA", abv: "6.2%", ibu: 50, srm: 6, color: "bg-emerald-600", img: "assets/img/beers/webp/lata_rock_ipa.webp", detailImg: "assets/img/beers/webp/info_rock_ipa.webp", tags: ["Cítrica", "Resinosa", "Intensa"] },
    { id: 5, name: "SCOTTISH", titleImg: "assets/img/beers/webp/scottish.webp", persona: "MARIE", category: "Rojas", style: "Scottish Ale", abv: "5.0%", ibu: 20, srm: 15, color: "bg-purple-600", img: "assets/img/beers/webp/lata_scottish.webp", detailImg: "assets/img/beers/webp/info_scottish.webp", tags: ["Maltosa", "Caramelo", "Cobriza"] },
    { id: 6, name: "STOUT", titleImg: "assets/img/beers/webp/stout.webp", persona: "AURA", category: "Negras", style: "Stout", abv: "6.0%", ibu: 25, srm: 32, color: "bg-[#e07a5f]", img: "assets/img/beers/webp/lata_stout.webp", detailImg: "assets/img/beers/webp/info_stout.webp", tags: ["Robusta", "Café", "Avena"] }
];

export const partnersData = [
    {
        name: "Medalla Bar",
        type: "Resto Bar",
        location: "Freyre, Córdoba",
        address: "Bv. 25 de Mayo 903",
        features: ["Gastronomía", "Cerveza Tirada"],
        varieties: ["Golden", "Honey", "Red IPA", "Rock IPA", "Scottish", "Stout"],
        lat: -31.166778,
        lng: -62.101083,
        isOfficial: true,
        logo: "assets/img/ui/logo_medalla.webp",
        phone: "+54 9 3564 638157",
        instagram: "@medallabar",
        facebook: ""
    },
    {
        name: "Medalla Fábrica",
        type: "Fábrica",
        location: "Freyre, Córdoba",
        address: " ",
        features: ["Fábrica"],
        varieties: ["Golden", "Honey", "Red IPA", "Rock IPA", "Scottish", "Stout"],
        lat: -31.166930,
        lng: -62.100507,
        isOfficial: true,
        logo: "assets/img/ui/logo_medalla.webp",
        phone: "+54 9 3564 232650",
        instagram: "@medallacerveza",
        facebook: "medallacerveza"
    },
    {
        name: "Hotel San Martín",
        type: "Punto de Venta",
        location: "Suardi, Santa Fe",
        address: "Bv. San Martín 912",
        features: ["Latas", "Barriles"],
        varieties: ["Consultar Stock"],
        lat: -30.5358,
        lng: -61.9539,
        logo: "assets/img/partners/webp/pv_hotel_san_martin.webp",
        phone: "+54 9 3562 545460",
        instagram: "@hotelsmsuardi",
        mail: "sanmartinhotel.suardi@gmail.com"
    },
    {
        name: "Punto Medalla San Francisco",
        type: "Distribuidor",
        location: "San Francisco, Córdoba",
        address: "Contacto: 3564 336555",
        features: ["Alquiler Barriles", "Latas"],
        varieties: ["Todas las Variedades"],
        lat: -31.4279,
        lng: -62.0827,
        logo: "assets/img/ui/logo_sf.webp",
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
        logo: "assets/img/ui/logo_portena.webp",
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
        logo: "assets/img/ui/logo_brinkmann.webp",
        phone: "3562 523828",
        instagram: "@medalla.brinkmann"
    },
    {
        name: "MABDRINKS",
        type: "Boutique de bebidas",
        location: "Morteros, Córdoba",
        address: "Contacto: 3562 454991",
        features: ["Latas", "Barriles"],
        varieties: ["Consultar Stock"],
        lat: -30.715506,
        lng: -62.008406,
        logo: "assets/img/ui/logo_morteros.webp",
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
        logo: "assets/img/ui/logo_devoto.webp",
        instagram: "@medalla.devoto"
    }
];

export const eventsData = [
    {
        title: "AFTER OFFICE MEDALLA",
        // Setting a future date for demo (e.g., Feb 15 2026)
        date: "2026-02-15T19:00:00.000Z",
        locationName: "Medalla Bar Central",
        description: "Djs en vivo, 2x1 en pintas seleccionadas y la mejor gastronomía.",
        link: "#"
    },
    {
        title: "CATA DE VERANO",
        date: "2026-02-28T20:30:00.000Z",
        locationName: "Fábrica Medalla",
        description: "Probá nuestras nuevas IPAs experimentales junto a nuestro Brewmaster.",
        link: "#"
    },
    {
        title: "TORNEO DE TRUCO",
        date: "2026-03-10T21:00:00.000Z",
        locationName: "Medalla Bar Sur",
        description: "Inscripción gratuita. Premios en consumiciones y merch oficial.",
        link: "#"
    },
    {
        title: "NOCHE DE JAZZ",
        date: "2026-03-20T21:30:00.000Z",
        locationName: "Medalla Bar Central",
        description: "Música en vivo con las mejores bandas de jazz de la ciudad.",
        link: "#"
    },
    {
        title: "LANZAMIENTO OTOÑO",
        date: "2026-04-02T18:00:00.000Z",
        locationName: "Fábrica Medalla",
        description: "Presentación de nuestras nuevas estilos de temporada.",
        link: "#"
    }
];
