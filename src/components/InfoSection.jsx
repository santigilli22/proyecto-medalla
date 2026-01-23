import { useState } from 'react';
import Icon from './Icon';

const InfoSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "¿Tienen opciones sin alcohol?", a: "Por el momento, todas nuestras cervezas contienen alcohol. Sin embargo, ofrecemos agua mineral gratuita para conductores designados." },
        { q: "¿Puedo reservar para eventos privados?", a: "¡Sí! Nuestra fábrica está disponible para celebraciones exclusivas. Escribinos para conocer los paquetes y disponibilidad." },
        { q: "¿Son Pet Friendly?", a: "¡Absolutamente! En nuestro patio exterior las mascotas son bienvenidas siempre que estén con correa." },
        { q: "¿Tienen opciones sin TACC?", a: "Sí, contamos con opciones gastronómicas certificadas y sidra tirada en línea separada apta para celíacos." },
        { q: "¿Realizan visitas guiadas a la fábrica?", a: "Sí, todos los sábados a las 18hs realizamos el 'Medalla Tour' con degustación incluida. Requiere reserva previa." },
        { q: "¿Tienen Happy Hour?", a: "Sí, todos los días de 18 a 20hs obtené un 50% OFF en la segunda pinta de estilos seleccionados." },
        { q: "¿Realizan recarga de Growlers?", a: "¡Claro! Traé tu botellón limpio a cualquiera de nuestros puntos de venta y llevalo lleno de frescura al mejor precio." },
        { q: "¿Qué medios de pago aceptan?", a: "Aceptamos efectivo, tarjetas de crédito/débito y Mercado Pago. Tenemos promos bancarias los fines de semana." }
    ];

    return (
        <section id="faq" className="relative content-section reveal scroll-mt-0 bg-slate-900 flex flex-col pt-24 md:pt-32 pb-24 md:pb-32 min-h-[80vh]">

            <div className="absolute inset-0 bg-amber-900/5 z-0 pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-6 h-full">

                <div className="flex flex-col md:flex-row gap-12 lg:gap-20 h-full">

                    {/* Columna Izquierda: Título Sticky */}
                    <div className="md:w-1/3 shrink-0">
                        <div className="sticky top-32 flex flex-col gap-6 text-center md:text-left">
                            <div className="inline-flex self-center md:self-start p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30 shadow-lg shadow-amber-900/20 animate-float">
                                <Icon name="HelpCircle" size={40} className="text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 brand-font tracking-wide leading-tight">
                                    PREGUNTAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">FRECUENTES</span>
                                </h2>
                                <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8">
                                    Todo lo que necesitas saber para disfrutar tu experiencia Medalla al máximo. Si tenés otra duda, contactanos.
                                </p>
                                <a href="#footer" className="inline-flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-sm hover:text-white transition-colors group">
                                    Escribinos <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Grid de FAQs */}
                    <div className="md:w-2/3 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 self-start">
                        {faqs.map((item, idx) => (
                            <div
                                key={idx}
                                className={`
                                    border rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group
                                    ${openIndex === idx
                                        ? 'bg-slate-800/80 border-amber-500/50 shadow-lg shadow-amber-900/10 scale-[1.02]'
                                        : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'}
                                `}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full flex justify-between items-start gap-4 p-5 text-left cursor-pointer outline-none select-none h-full"
                                >
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-sm lg:text-base mb-2 transition-colors ${openIndex === idx ? 'text-amber-400' : 'text-slate-200 group-hover:text-white'}`}>
                                            {item.q}
                                        </h3>
                                        <div
                                            className={`
                                                grid transition-[grid-template-rows] duration-500 ease-in-out text-slate-400 text-sm leading-relaxed
                                                ${openIndex === idx ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}
                                            `}
                                        >
                                            <div className="overflow-hidden">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>

                                    <span className={`shrink-0 mt-1 transition-transform duration-300 ${openIndex === idx ? 'rotate-45 text-amber-500' : 'rotate-0 text-slate-500'}`}>
                                        <Icon name="Plus" size={20} />
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InfoSection;
