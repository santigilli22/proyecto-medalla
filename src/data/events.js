const BASE = import.meta.env.BASE_URL;

// Helper para fotos falsas
const generateAlbumPhotos = (baseImg, count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        src: baseImg,
        alt: `Foto ${i + 1}`
    }));
};

export const upcomingEvents = [
    {
        id: 101,
        day: "15",
        month: "FEB",
        title: "AFTER OFFICE MEDALLA",
        location: "Medalla Bar Central",
        time: "19:00 HS",
        description: "Djs en vivo, 2x1 en pintas seleccionadas y la mejor gastronomía.",
        link: "#"
    },
    {
        id: 102,
        day: "28",
        month: "FEB",
        title: "CATA DE VERANO",
        location: "Fábrica Medalla",
        time: "20:30 HS",
        description: "Probá nuestras nuevas IPAs experimentales junto a nuestro Brewmaster.",
        link: "#"
    },
    {
        id: 103,
        day: "10",
        month: "MAR",
        title: "TORNEO DE TRUCO",
        location: "Medalla Bar Sur",
        time: "21:00 HS",
        description: "Inscripción gratuita. Premios en consumiciones y merch oficial.",
    },
    {
        id: 104,
        day: "20",
        month: "MAR",
        title: "NOCHE DE JAZZ",
        location: "Medalla Bar Central",
        time: "21:30 HS",
        description: "Música en vivo con las mejores bandas de jazz de la ciudad.",
        link: "#"
    },
    {
        id: 105,
        day: "02",
        month: "ABR",
        title: "LANZAMIENTO OTOÑO",
        location: "Fábrica Medalla",
        time: "18:00 HS",
        description: "Presentación de nuestras nuevas estilos de temporada.",
        link: "#"
    }
];

export const pastAlbums = [
    {
        id: "P1",
        title: "FIN DE AÑO 2024",
        date: "31 DIC 2024",
        location: "Medalla Bar",
        cover: `${BASE}assets/img/events/event_newyear.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_newyear.webp`, 10)
    },
    {
        id: "P2",
        title: "HALLOWEEN FEST",
        date: "31 OCT 2024",
        location: "Fábrica Medalla",
        cover: `${BASE}assets/img/events/event_halloween.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_halloween.webp`, 12)
    },
    {
        id: "P3",
        title: "SAN PATRICIO",
        date: "17 MAR 2024",
        location: "Medalla Bar",
        cover: `${BASE}assets/img/events/event_stpatrick.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_stpatrick.webp`, 10)
    },
    {
        id: "P4",
        title: "FESTIVAL VERANO",
        date: "ENE 2024",
        location: "Plaza Central",
        cover: `${BASE}assets/img/events/event_festival.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_festival.webp`, 15)
    },
    {
        id: "P5",
        title: "OKTOBERFEST",
        date: "OCT 2023",
        location: "Predio Ferial",
        cover: `${BASE}assets/img/events/event_festival.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_festival.webp`, 20)
    },
    {
        id: "P6",
        title: "ANIVERSARIO #5",
        date: "AGO 2023",
        location: "Fábrica Medalla",
        cover: `${BASE}assets/img/events/event_newyear.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_newyear.webp`, 8)
    },
    {
        id: "P7",
        title: "NOCHE DE BURGERS",
        date: "JUL 2023",
        location: "Medalla Bar Sur",
        cover: `${BASE}assets/img/events/event_halloween.webp`,
        gallery: generateAlbumPhotos(`${BASE}assets/img/events/event_halloween.webp`, 5)
    }
];
