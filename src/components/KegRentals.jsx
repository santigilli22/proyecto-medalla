import { useState } from 'react';
import Icon from './Icon';
import { kegsData } from '../data/kegs';

const KegRentals = () => {
    const [openIndex, setOpenIndex] = useState(-1);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section id="kegs" className="min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-center relative overflow-hidden bg-slate-950 border-t border-slate-900 content-section reveal pt-[88px] pb-4 lg:pb-0">
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
                </div>

                {/* Kegs Container: Flex Column (Mobile/Tablet) | Horizontal Flex Deck (Desktop) */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 flex-1 min-h-0 lg:items-stretch lg:justify-center">
                    {kegsData.map((keg, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <div
                                key={idx}
                                onClick={() => window.innerWidth < 1024 ? toggleAccordion(idx) : setOpenIndex(idx)}
                                onMouseEnter={() => window.innerWidth >= 1024 && setOpenIndex(idx)}
                                onMouseLeave={() => window.innerWidth >= 1024 && setOpenIndex(-1)}
                                className={`
                                    group relative bg-slate-800/20 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 ease-out will-change-[flex-grow]
                                    lg:cursor-pointer
                                    ${isOpen
                                        ? 'lg:flex-[3] lg:bg-slate-800/60 lg:shadow-2xl lg:shadow-amber-900/20 border-amber-500/30'
                                        : 'lg:flex-[1] lg:opacity-80'
                                    }
                                    ${isOpen ? 'bg-slate-800/40 border-amber-500/20 shadow-lg' : ''}
                                `}
                            >
                                {/* Glow Effect (Desktop Only) */}
                                <div className={`hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                                {/* Background Image for Deck (Visible) */}
                                <div className="absolute inset-0 z-0 overflow-hidden">
                                    <img
                                        src={keg.img}
                                        alt=""
                                        className={`w-full h-full object-cover lg:w-auto lg:max-w-none lg:min-w-full lg:absolute lg:left-1/2 lg:-translate-x-1/2 transition-opacity duration-700 ${isOpen ? 'opacity-10 lg:opacity-20 blur-sm' : 'opacity-40 lg:opacity-60 grayscale hover:grayscale-0'}`}
                                    />
                                    <div className="absolute inset-0"></div>
                                </div>

                                {/* Accordion Header (Visible on Mobile/Tablet) */}
                                <div className="flex items-center justify-between p-6 lg:hidden" onClick={(e) => { e.stopPropagation(); toggleAccordion(idx); }}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-amber-500'}`}>
                                            <Icon name="Package" size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-xl font-bold brand-font tracking-wide ${isOpen ? 'text-amber-500' : 'text-amber-500'}`}>{keg.size}</h3>
                                        </div>
                                    </div>
                                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-500' : 'text-amber-500'}`}>
                                        <Icon name="ChevronDown" size={20} />
                                    </div>
                                </div>

                                {/* Content Wrapper */}
                                <div className={`
                                    relative z-10 w-full h-full flex flex-col
                                    lg:px-8 lg:py-10
                                    ${isOpen ? 'px-6 pb-6 animate-fadeIn lg:animate-none' : 'hidden lg:flex'}
                                `}>

                                    {/* Desktop: Compressed State Title (Vertical) */}
                                    <div className={`hidden lg:flex absolute inset-0 items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-0 invisible delay-0' : 'opacity-100 visible delay-300'}`}>
                                        <h3 className="text-3xl font-bold text-amber-500 brand-font tracking-widest [writing-mode:vertical-rl] rotate-180 drop-shadow-lg">{keg.size}</h3>
                                    </div>

                                    {/* Expanded Content (Desktop) */}
                                    <div className={`lg:flex lg:flex-col lg:h-full transition-all duration-500 ${isOpen ? 'lg:opacity-100 lg:translate-y-0 lg:delay-200' : 'lg:opacity-0 lg:translate-y-4 lg:pointer-events-none lg:absolute lg:inset-0'}`}>

                                        {/* Header with Icon and Title */}
                                        <div className="hidden lg:flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-900/20">
                                                <Icon name="Package" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-4xl font-bold text-white brand-font tracking-wide">{keg.size}</h3>
                                                <p className="text-slate-400 text-lg font-medium">{keg.serves}</p>
                                            </div>
                                        </div>

                                        {/* Main Content Area */}
                                        <div className="flex-1 flex flex-col items-center justify-center h-full min-h-0 overflow-hidden">

                                            {/* Info & Actions - Full Width */}
                                            <div className="w-full max-w-3xl flex flex-col justify-center items-center text-center py-2 h-full">
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <p className="text-slate-300 text-base md:text-lg xl:text-2xl leading-relaxed mb-3">Ideal para <span className="text-white font-bold text-lg md:text-xl xl:text-3xl block mt-1">{keg.ideal}</span></p>

                                                    <div className="h-1 w-24 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full my-4 xl:my-6 mx-auto opacity-80"></div>

                                                    <p className="text-slate-400 text-sm md:text-base xl:text-lg leading-relaxed max-w-xl mx-auto px-4">{keg.description}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Content (Simplified) */}
                                    <div className="lg:hidden">

                                        <p className="text-slate-400 text-sm mb-6 text-center">Ideal para <span className="text-slate-200 font-semibold">{keg.ideal}</span></p>
                                        <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-3">
                                            <button className="w-full py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-white/5 flex items-center justify-center gap-2">
                                                Consultar Disponibilidad
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section >
    );
};

export default KegRentals;
