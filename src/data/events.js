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
        link: "#"
    }
];

export const pastAlbums = [
    {
        id: "P1",
        title: "FIN DE AÑO 2024",
        date: "31 DIC 2024",
        location: "Medalla Bar",
        cover: "/event_newyear.png",
        gallery: generateAlbumPhotos("/event_newyear.png", 10)
    },
    {
        id: "P2",
        title: "HALLOWEEN FEST",
        date: "31 OCT 2024",
        location: "Fábrica Medalla",
        cover: "/event_halloween.png",
        gallery: generateAlbumPhotos("/event_halloween.png", 12)
    },
    {
        id: "P3",
        title: "SAN PATRICIO",
        date: "17 MAR 2024",
        location: "Medalla Bar",
        cover: "/event_stpatrick.png",
        gallery: generateAlbumPhotos("/event_stpatrick.png", 10)
    },
    {
        id: "P4",
        title: "FESTIVAL VERANO",
        date: "ENE 2024",
        location: "Plaza Central",
        cover: "/event_festival.png",
        gallery: generateAlbumPhotos("/event_festival.png", 15)
    }
];
