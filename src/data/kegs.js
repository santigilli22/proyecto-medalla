const BASE = import.meta.env.BASE_URL;

export const kegsData = [
    {
        size: "10 Litros",
        serves: "~20 Pintas",
        ideal: "Pequeñas Reuniones",
        price: "Consultar",
        iconSize: 48,
        stock: 100,
        img: `${BASE}assets/img/kegs/keg_10l_celebration.webp`,
        description: "Ideal para una cena con amigos cercanos o una previa antes de salir. La medida justa para disfrutar de una buena cerveza tirada sin excesos."
    },
    {
        size: "20 Litros",
        serves: "~40 Pintas",
        ideal: "Cumpleaños y Asados",
        price: "Consultar",
        iconSize: 56,
        stock: 50,
        img: `${BASE}assets/img/kegs/keg_20l_celebration.webp`,
        description: "El clásico de los fines de semana. Perfecto para cumpleaños en casa, asados familiares o esas juntadas que se extienden hasta tarde."
    },
    {
        size: "30 Litros",
        serves: "~60 Pintas",
        ideal: "Eventos Medianos",
        price: "Consultar",
        iconSize: 60,
        stock: 35,
        img: `${BASE}assets/img/kegs/keg_30l_celebration.webp`,
        description: "Cuando la convocatoria supera lo habitual. Excelente para despedidas, recibidas o reuniones donde la sed es protagonista y nadie quiere quedarse corto."
    },
    {
        size: "50 Litros",
        serves: "~100 Pintas",
        ideal: "Grandes Eventos",
        price: "Consultar",
        iconSize: 64,
        stock: 20,
        img: `${BASE}assets/img/kegs/keg_50l_celebration.webp`,
        description: "Pensado para casamientos, fiestas corporativas o festivales. La solución definitiva para abastecer a una multitud y asegurar el éxito del evento."
    }
];
