import { useState, useMemo } from 'react';
import Icon from './Icon';
import ModalPortal from './ui/ModalPortal';
import { partnersData } from '../data/partners';

import PartnersMap from './PartnersMap';

const BeerFinder = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fallback logo genérico si no tiene uno específico
    const getLogo = (partner) => partner.logo || `${import.meta.env.BASE_URL}assets/img/ui/logo_medalla.webp`;

    const filteredPartners = useMemo(() => {
        return partnersData.filter(p => {
            const typeLower = p.type.toLowerCase();
            const filterLower = filter.toLowerCase();
            const matchesType = filter === 'all' || typeLower.includes(filterLower) || (filter === 'restaurante' && typeLower.includes('resto'));
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.address.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [filter, searchTerm]);

    return (
        <section id="locator" className="bg-[#0B0F19] content-section reveal pt-24 md:pt-28 flex flex-col h-screen overflow-hidden relative">

            {/* Background elements (Golden Night Theme) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/40 via-[#0B0F19] to-[#0B0F19]"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col h-full gap-4 lg:gap-8 pb-4">

                {/* Header & Controls */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-4 lg:gap-8 shrink-0">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-500/30 shadow-lg shadow-amber-900/20 animate-float hidden md:block">
                            <Icon name="Map" size={32} className="text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white brand-font tracking-wide">PUNTOS DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">ENCUENTRO</span></h2>
                            <p className="text-slate-400 text-sm mt-2">Encontrá tu Medalla en nuestra red de partners oficiales.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto bg-slate-800/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <div className="relative flex-1 sm:w-72">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o ciudad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 pl-10 text-white text-sm focus:border-amber-500 outline-none transition-all placeholder-slate-500"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon name="Search" size={18} /></div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {['all', 'fábrica', 'bar', 'tienda'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border capitalize ${filter === type ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
                                >
                                    {type === 'all' ? 'Todos' : type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MOBILE / TABLET MAP VIEW (< lg) */}
                <div className="block lg:hidden w-full flex-1 min-h-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative z-20">
                    <PartnersMap partners={filteredPartners} onMarkerClick={setSelectedLocation} />
                </div>

                {/* DESKTOP VIEW (>= lg) */}
                <div className="hidden lg:flex w-full flex-1 items-center justify-center relative overflow-hidden mask-scroll">

                    {filteredPartners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                            <Icon name="Map" size={48} className="mb-4 opacity-50" />
                            <p className="text-xl">No se encontraron puntos de encuentro con ese criterio.</p>
                        </div>
                    ) : (
                        <div className="w-full h-[500px] relative flex items-center">
                            {/* Condition: <= 4 (Static Center) OR > 4 (Infinite Scroll) */}
                            {filteredPartners.length <= 4 ? (
                                <div className="flex justify-center gap-8 w-full">
                                    {filteredPartners.map((partner, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedLocation(partner)}
                                            className="group relative bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-6 pb-14 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center gap-4 overflow-hidden h-full sm:min-w-[300px] max-w-[350px]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Logo Circle */}
                                            <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-amber-500 shadow-lg flex items-center justify-center p-4 transition-colors relative z-10 shrink-0">
                                                <img src={getLogo(partner)} alt={partner.name} className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0" />
                                            </div>

                                            <div className="relative z-10 w-full flex flex-col flex-1">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors mb-2 truncate brand-font tracking-wide">{partner.name}</h3>
                                                <p className="text-sm text-slate-400 uppercase tracking-widest mb-4 h-10">{partner.location}</p>

                                                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                                                    <span className="text-xs px-3 py-1 rounded bg-slate-950/50 border border-slate-700 text-slate-500 group-hover:text-slate-300 transition-colors">
                                                        {partner.type}
                                                    </span>
                                                    {partner.isOfficial && <span className="text-xs px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500">Oficial</span>}
                                                </div>
                                            </div>

                                            {/* Hover Action */}
                                            <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                                Ver Detalles <Icon name="Plus" size={14} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex gap-8 absolute animate-infinite-scroll hover:pause hover:cursor-grab pb-4 pl-4" style={{ width: 'max-content' }}>
                                    {/* Render twice for seamless loop */}
                                    {Array(2).fill(filteredPartners).flat().map((partner, idx) => (
                                        <div
                                            key={`loop-${idx}`}
                                            onClick={() => setSelectedLocation(partner)}
                                            className="group relative bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-6 pb-14 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center gap-4 overflow-hidden h-full min-w-[300px] max-w-[350px]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Logo Circle */}
                                            <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-amber-500 shadow-lg flex items-center justify-center p-4 transition-colors relative z-10 shrink-0">
                                                <img src={getLogo(partner)} alt={partner.name} className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0" />
                                            </div>

                                            <div className="relative z-10 w-full flex flex-col flex-1">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-amber-500 transition-colors mb-2 truncate brand-font tracking-wide">{partner.name}</h3>
                                                <p className="text-sm text-slate-400 uppercase tracking-widest mb-4 h-10">{partner.location}</p>

                                                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                                                    <span className="text-xs px-3 py-1 rounded bg-slate-950/50 border border-slate-700 text-slate-500 group-hover:text-slate-300 transition-colors">
                                                        {partner.type}
                                                    </span>
                                                    {partner.isOfficial && <span className="text-xs px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500">Oficial</span>}
                                                </div>
                                            </div>

                                            {/* Hover Action */}
                                            <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                                Ver Detalles <Icon name="Plus" size={14} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detallado (Preserved) */}
            {selectedLocation && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedLocation(null)}>
                        {/* Modal Container: h-[90vh] on mobile/tablet, auto on desktop */}
                        <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl lg:max-w-5xl h-[90vh] lg:h-auto lg:min-h-[500px] relative shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-scaleIn" onClick={e => e.stopPropagation()}>

                            {/* Close Button */}
                            <button onClick={() => setSelectedLocation(null)} className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-rose-600 transition-colors pointer-events-auto">
                                <Icon name="X" size={20} />
                            </button>

                            {/* Left: Info & Branding - Scrollable on mobile */}
                            <div className="lg:w-1/2 p-6 md:p-8 flex flex-col relative overflow-y-auto flex-1 bg-slate-900/50">
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                                {/* Header */}
                                <div className="flex items-center gap-6 mb-8 shrink-0">
                                    <div className="w-24 h-24 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center shadow-lg shrink-0 p-2">
                                        <img src={getLogo(selectedLocation)} alt={selectedLocation.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-1">{selectedLocation.type}</span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight brand-font">{selectedLocation.name}</h3>
                                        <p className="text-slate-400 text-sm">{selectedLocation.location}</p>
                                    </div>
                                </div>

                                {/* Body Info */}
                                <div className="space-y-6 text-sm text-slate-300 flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-white font-bold flex items-center gap-2 mb-2"><Icon name="MapPin" size={16} className="text-amber-500" /> Dirección</p>
                                            <p className="pl-6">{selectedLocation.address}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-white font-bold flex items-center gap-2 mb-2"><Icon name="Phone" size={16} className="text-amber-500" /> Contacto</p>
                                            <p className="pl-6">{selectedLocation.phone || "No especificado"}</p>
                                        </div>
                                    </div>

                                    {/* Socials */}
                                    <div className="pt-2">
                                        <p className="text-white font-bold flex items-center gap-2 mb-3"><Icon name="Share2" size={16} className="text-amber-500" /> Redes Sociales</p>
                                        <div className="flex flex-wrap gap-3 pl-6">
                                            {selectedLocation.instagram && (
                                                <a href={`https://instagram.com/${selectedLocation.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-900 border border-slate-700 py-2 px-4 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/10 transition-all">
                                                    <Icon name="Instagram" size={16} /> Instagram
                                                </a>
                                            )}
                                            {selectedLocation.facebook && (
                                                <a href={`https://facebook.com/${selectedLocation.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-900 border border-slate-700 py-2 px-4 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all">
                                                    <Icon name="Facebook" size={16} /> Facebook
                                                </a>
                                            )}
                                            {selectedLocation.web && (
                                                <a href={selectedLocation.web} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-900 border border-slate-700 py-2 px-4 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
                                                    <Icon name="Globe" size={16} /> Web
                                                </a>
                                            )}
                                            {(!selectedLocation.instagram && !selectedLocation.facebook && !selectedLocation.web) && (
                                                <span className="text-slate-600 italic">No disponible</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Stock */}
                                <div className="mt-8 pt-6 border-t border-slate-800 shrink-0">
                                    <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-bold">Disponibilidad / Variedades</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedLocation.varieties.map((v, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs font-bold text-slate-400 hover:text-white hover:border-amber-500/30 transition-colors cursor-default">{v}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Map Embed Image - Fixed height on mobile */}
                            <div className="lg:w-1/2 bg-slate-900 relative h-64 lg:h-auto lg:min-h-full shrink-0">
                                <div className="absolute inset-0 z-0">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(85%)' }}
                                        src={`https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&z=15&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                    <div className="absolute inset-0 bg-amber-500/10 pointer-events-none mix-blend-overlay"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                                    <button
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`, '_blank')}
                                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                                    >
                                        <Icon name="Navigation" size={18} /> Cómo Llegar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

        </section>
    );
};

export default BeerFinder;
