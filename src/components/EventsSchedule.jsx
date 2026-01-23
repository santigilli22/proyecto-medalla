import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import ModalPortal from './ui/ModalPortal';
import { upcomingEvents, pastAlbums } from '../data/events';

const EventsSchedule = () => {

    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedUpcoming, setSelectedUpcoming] = useState(null);

    // Refs for carousels
    const upcomingRef = useRef(null);
    const galleryRef = useRef(null);

    // Auto-scroll logic (Generic)
    useEffect(() => {
        const autoScroll = (ref) => {
            if (!ref.current) return;
            // Disable auto-scroll on small/medium screens
            if (window.innerWidth < 1024) return;

            // ScrollBy one item width approx or screen width
            if (ref.current.scrollLeft + ref.current.clientWidth >= ref.current.scrollWidth - 5) {
                ref.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                ref.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        };

        const intervalUpcoming = setInterval(() => autoScroll(upcomingRef), 4000);
        const intervalGallery = setInterval(() => autoScroll(galleryRef), 5000);

        return () => {
            clearInterval(intervalUpcoming);
            clearInterval(intervalGallery);
        };
    }, []);

    // Bloquear scroll
    useEffect(() => {
        if (selectedAlbum || selectedPhoto || selectedUpcoming) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [selectedAlbum, selectedPhoto, selectedUpcoming]);

    const closeLightbox = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    }

    return (
        <section id="events" className="relative bg-[#0B0F19] text-white min-h-screen w-full flex flex-col overflow-hidden content-section reveal pt-[88px] pb-10">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-amber-900/40 via-[#0B0F19] to-[#0B0F19]"></div>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col gap-12">

                {/* Header Section */}
                <div className="text-center mb-4">
                    <h4 className="text-amber-500 font-bold tracking-[0.2em] uppercase mb-2 text-xs animate-pulse">Comunidad & Cultura</h4>
                    <h2 className="text-4xl lg:text-6xl font-bold brand-font text-white mb-4">AGENDA <span className="text-amber-500">MEDALLA</span></h2>
                    <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                        El punto de encuentro. Enterate de lo que se viene y reviví lo que pasó.
                    </p>
                </div>

                {/* SECCION 1: PRÓXIMOS EVENTOS (CAROUSEL) */}
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <Icon name="Calendar" className="text-amber-500" size={24} />
                        <h3 className="text-xl font-bold brand-font tracking-wide">PRÓXIMOS EVENTOS</h3>
                    </div>

                    <div
                        ref={upcomingRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {upcomingEvents.map(ev => (
                            <div
                                key={ev.id}
                                onClick={() => setSelectedUpcoming(ev)}
                                className="snap-center shrink-0 min-w-[280px] md:min-w-[320px] bg-slate-800/40 hover:bg-slate-800 border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg cursor-pointer flex flex-col gap-4 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex-none flex flex-col items-center justify-center bg-slate-950 border border-slate-700/50 rounded-xl w-14 h-14 group-hover:border-amber-500 transition-colors">
                                        <span className="text-xl font-bold text-white leading-none">{ev.day}</span>
                                        <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mt-0.5">{ev.month}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition-colors truncate">{ev.title}</h4>
                                        <span className="text-xs text-slate-400 flex items-center gap-1"><Icon name="MapPin" size={12} /> {ev.location}</span>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-3 mt-auto">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-300 flex items-center gap-1"><Icon name="Clock" size={12} className="text-amber-500" /> {ev.time}</span>
                                        <span className="text-amber-500 font-bold uppercase tracking-wider group-hover:underline">Ver Info</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECCION 2: GALERÍA (CAROUSEL) */}
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <Icon name="Image" className="text-amber-500" size={24} />
                        <h3 className="text-xl font-bold brand-font tracking-wide">GALERÍA DE RECUERDOS</h3>
                    </div>

                    <div
                        ref={galleryRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {pastAlbums.map(album => (
                            <div
                                key={album.id}
                                className="snap-center shrink-0 w-64 h-48 md:w-auto md:h-auto md:min-w-[350px] md:aspect-video group cursor-pointer relative rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                                onClick={() => setSelectedAlbum(album)}
                            >
                                <img
                                    src={album.cover}
                                    alt={album.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h4 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-amber-400 transition-colors drop-shadow-md line-clamp-2">{album.title}</h4>
                                    <p className="text-slate-300 text-xs flex items-center gap-2">
                                        <span>{album.date}</span>
                                        <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                        <span className="flex items-center gap-1"><Icon name="Camera" size={10} /> {album.gallery.length}</span>
                                    </p>
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-amber-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shadow-xl">
                                    <Icon name="Plus" size={24} className="text-slate-900" strokeWidth={3} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Modal de Galería (Reutilizado) */}
            {selectedAlbum && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[9990] bg-black/90 backdrop-blur-md transition-all" onClick={() => setSelectedAlbum(null)}></div>

                    <div className="fixed inset-0 md:inset-10 z-[9999] flex flex-col pointer-events-none animate-zoomIn">
                        {/* Centered Modal Container */}
                        <div className="flex-1 w-full max-w-6xl mx-auto bg-slate-950 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-800 pointer-events-auto">

                            {/* Header */}
                            <div className="flex flex-none justify-between items-center p-6 border-b border-white/10 bg-slate-900 z-10">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase brand-font mb-1">{selectedAlbum.title}</h3>
                                    <p className="text-sm text-amber-500 font-bold tracking-wider">{selectedAlbum.date} • {selectedAlbum.location}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedAlbum(null)}
                                    className="p-2 bg-slate-800 hover:bg-rose-600 rounded-full text-white transition-colors border border-white/10"
                                >
                                    <Icon name="X" size={24} />
                                </button>
                            </div>

                            {/* Grid */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50 custom-scrollbar">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {selectedAlbum.gallery.map((photo, idx) => (
                                        <div
                                            key={idx}
                                            className="aspect-square rounded-lg overflow-hidden relative group cursor-zoom-in bg-slate-900 border border-white/5 shadow-sm"
                                            onClick={() => setSelectedPhoto(photo)}
                                        >
                                            <img
                                                src={photo.src}
                                                alt={photo.alt}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Icon name="Maximize" size={20} className="text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Lightbox (Reutilizado) */}
            {selectedPhoto && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-fadeIn" onClick={closeLightbox}>
                        <button className="absolute top-6 right-6 p-4 text-white hover:text-amber-500 transition-colors z-50">
                            <Icon name="X" size={32} />
                        </button>
                        <div className="relative max-w-[95vw] max-h-[95vh]" onClick={e => e.stopPropagation()}>
                            <img src={selectedPhoto.src} alt={selectedPhoto.alt} className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl" />
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Modal Detalle Próximo Evento */}
            {selectedUpcoming && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[9995] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-all" onClick={() => setSelectedUpcoming(null)}>
                        <div className="bg-slate-950 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-zoomIn relative" onClick={e => e.stopPropagation()}>

                            {/* Decorative Top */}
                            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-700"></div>

                            <button
                                onClick={() => setSelectedUpcoming(null)}
                                className="absolute top-4 right-4 p-2 bg-slate-900/50 hover:bg-rose-600 rounded-full text-white transition-colors z-10"
                            >
                                <Icon name="X" size={20} />
                            </button>

                            <div className="p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-none flex flex-col items-center justify-center bg-slate-900 border border-amber-500/50 rounded-xl w-20 h-20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                        <span className="text-3xl font-bold text-white leading-none">{selectedUpcoming.day}</span>
                                        <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mt-1">{selectedUpcoming.month}</span>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h3 className="text-2xl font-bold text-white leading-tight brand-font mb-2">{selectedUpcoming.title}</h3>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold tracking-wider border border-amber-500/20">
                                            <Icon name="Star" size={12} /> EVENTO DESTACADO
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-amber-500">
                                            <Icon name="Clock" size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Horario</p>
                                            <p className="font-medium">{selectedUpcoming.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-amber-500">
                                            <Icon name="MapPin" size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Ubicación</p>
                                            <p className="font-medium">{selectedUpcoming.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 p-5 rounded-xl border border-white/5 mb-8">
                                    <p className="text-slate-300 leading-relaxed italic text-center">
                                        "{selectedUpcoming.description}"
                                    </p>
                                </div>

                                <button
                                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2"
                                    onClick={() => {
                                        const eventTitle = encodeURIComponent(`Medalla: ${selectedUpcoming.title}`);
                                        const eventDetails = encodeURIComponent(selectedUpcoming.description);
                                        const eventLocation = encodeURIComponent(selectedUpcoming.location);
                                        // Simple date estimation for demo purposes since we lack year/iso
                                        const calUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}`;
                                        window.open(calUrl, '_blank');
                                    }}
                                >
                                    <Icon name="Calendar" size={18} /> Agendar en Google
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </section>
    );
};

export default EventsSchedule;
