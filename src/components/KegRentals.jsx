import { useState } from 'react';
import Icon from './Icon';
import { kegsData } from '../data/kegs';

const KegRentals = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section id="kegs" className="min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-center relative overflow-hidden bg-slate-950 border-t border-slate-900 content-section reveal py-12 pt-24 md:pt-28 md:pb-8 lg:pb-0">
            {/* Background Ambient Lighting */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col h-full lg:justify-center">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 md:mb-10 lg:mb-8 shrink-0 lg:mt-20">
                    <div className="max-w-2xl text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 whitespace-nowrap brand-font tracking-wide">
                            LLEVA LA FIESTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">A CASA</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl">Alquiler de choperas y barriles para todo tipo de eventos.</p>
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-3 shadow-lg shadow-green-900/30 hover:scale-105 cursor-pointer border border-green-400/20 group shrink-0">
                        <Icon name="Phone" size={24} className="group-hover:rotate-12 transition-transform" />
                        <span>Reservar por WhatsApp</span>
                    </button>
                </div>

                {/* Kegs Container: Flex Column (Mobile/Tablet) | Grid (Desktop) */}
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-8 flex-1 min-h-0 lg:items-stretch">
                    {kegsData.map((keg, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <div
                                key={idx}
                                onClick={() => window.innerWidth < 1024 && toggleAccordion(idx)}
                                className={`
                                    group relative bg-slate-800/20 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-500
                                    lg:flex lg:flex-col lg:items-center lg:text-center lg:p-8 lg:hover:border-amber-500/30 lg:hover:-translate-y-2 lg:hover:shadow-2xl lg:hover:shadow-amber-900/10 lg:h-full lg:cursor-default
                                    ${isOpen ? 'bg-slate-800/40 border-amber-500/20 shadow-lg' : 'hover:bg-slate-800/30 cursor-pointer'}
                                `}
                            >
                                {/* Glow Effect (Desktop Only) */}
                                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Accordion Header (Visible on Mobile/Tablet) */}
                                <div className="flex items-center justify-between p-6 lg:hidden">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-400'}`}>
                                            <Icon name="Package" size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-xl font-bold brand-font tracking-wide ${isOpen ? 'text-white' : 'text-slate-300'}`}>{keg.size}</h3>
                                            <p className="text-xs text-slate-500">{keg.serves}</p>
                                        </div>
                                    </div>
                                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : 'text-slate-500'}`}>
                                        <Icon name="ChevronDown" size={20} />
                                    </div>
                                </div>

                                {/* Content: Collapsible on Mobile, Always Visible on Desktop */}
                                <div className={`
                                    lg:contents
                                    ${isOpen ? 'block px-6 pb-6 animate-fadeIn' : 'hidden'}
                                `}>
                                    {/* Keg Image */}
                                    <div className="relative z-10 w-full lg:h-56 mb-6 flex items-center justify-center">
                                        <img
                                            src={keg.img}
                                            alt={`Barril ${keg.size}`}
                                            className="h-48 lg:h-full w-auto object-contain drop-shadow-2xl transition-transform duration-500 lg:group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Desktop Title (Hidden on Mobile Header) */}
                                    <div className="hidden lg:block relative z-10 w-full">
                                        <h3 className="text-3xl font-bold text-white mb-2 brand-font tracking-wider">{keg.size}</h3>
                                    </div>

                                    {/* Shared Content */}
                                    <div className="relative z-10 w-full lg:flex-1 lg:flex lg:flex-col">

                                        <div className="hidden lg:flex items-center justify-center gap-2 mb-6">
                                            <span className="text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg text-sm font-bold border border-amber-500/20">
                                                {keg.serves}
                                            </span>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6 lg:min-h-[40px]">Ideal para <span className="text-slate-200 font-semibold">{keg.ideal}</span></p>

                                        <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-3 lg:mt-auto">
                                            <button className="w-full py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 group/btn">
                                                Consultar Disponibilidad
                                                <Icon name="ArrowRight" size={16} className="text-amber-500 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                            {keg.stock > 0 && (
                                                <span className="text-xs text-green-500 font-medium flex items-center justify-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                    Stock disponible
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default KegRentals;
