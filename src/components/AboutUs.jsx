import { useState } from 'react';
import Icon from './Icon';

const AboutUs = () => {
    return (
        <section id="about" className="relative bg-slate-950 min-h-screen flex items-center py-12 md:py-20 overflow-hidden content-section reveal">

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Header Editorial */}
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-8 border-b border-amber-900/30 pb-6">
                    <div className="max-w-2xl">
                        <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-xs mb-2 block">Nuestra Historia</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white brand-font leading-tight">
                            LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-700">REVOLUCIÓN</span> ARTESANAL
                        </h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-6xl font-mono font-bold text-amber-500">2010</p>
                        <p className="text-slate-500 text-xs tracking-widest uppercase">Año de Fundación</p>
                    </div>
                </div>

                {/* Editorial Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                    {/* Columna Izquierda: Imagen Principal + Caption */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="relative group overflow-hidden rounded-tr-[4rem] rounded-bl-[4rem] border border-slate-800 shadow-2xl h-[45vh] lg:h-[50vh]">
                            <div className="absolute bg-amber-500/10 group-hover:bg-transparent transition-colors z-10"></div>
                            <img
                                src={`${import.meta.env.BASE_URL}assets/img/misc/socios.webp`}
                                alt="Equipo Medalla"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 bg-slate-950/90 p-4 border-t border-r border-amber-500/30 backdrop-blur-md rounded-tr-2xl">
                                <p className="text-white font-bold brand-font text-lg">EQUIPO MEDALLA</p>
                                <p className="text-amber-500 text-[10px] text-right tracking-widest uppercase">Freyre, Córdoba</p>
                            </div>
                        </div>
                        <p className="text-amber-500 text-sm italic font-serif leading-relaxed pl-4 border-l-2 border-slate-900/50">
                            " CUATRO TIPOS QUE VIVEN SIMPLE Y SUEÑAN EN GRANDE "
                        </p>
                    </div>

                    {/* Columna Derecha: Texto Narrativo + Stats */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8">

                        {/* Texto con Drop Cap */}
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed text-justify">
                                <span className="float-left text-5xl font-bold text-amber-500 mr-3 mt-[-5px] brand-font border-b-4 border-slate-800 pb-1">U</span>
                                n loco rockero con alma eterna de niño, fanático incomparable de la cerveza; comienza en el 2010 con su anhelado proyecto <span className="text-transparent bg-clip-text bg-gradient-to-r font-bold from-amber-400 to-amber-500">MEDALLA</span>. Tal vez no imaginó que el patio de su casa era el inicio de una eterna y refrescante gira. En el camino se suman tres birreros: un ingeniero y lector empedernido, al que resulta casi imposible encontrarle un error de cálculo. El tercero es inquieto; relacionista público que va detectando oportunidades; y números también. El cuarto integrante es el más “pequeño”, moderno, fanático del detalle y la prolijidad, de los más cautos y precavidos a la hora de largar su opinión.
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mt-4">
                                Cuatro socios, que junto a un gran equipo, hoy producen en su propia fábrica 6 estilos de Cerveza Medalla: Golden, Red Ipa, Rock Ipa, Honey, Stout y Scottish. Que la travesía y el desafío te persigan siempre para lanzarte a un próximo vuelo… Sólo échale valentía.
                            </p>
                        </div>

                        {/* Stats Grid Minimalista */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-800/50">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white mb-1">6</p>
                                <p className="text-xs text-amber-500 uppercase tracking-wider">Estilos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white mb-1">50 k</p>
                                <p className="text-xs text-amber-500 uppercase tracking-wider">Litros/Mes</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white mb-1">7</p>
                                <p className="text-xs text-amber-500 uppercase tracking-wider">Puntos de Venta</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white mb-1">∞</p>
                                <p className="text-xs text-amber-500 uppercase tracking-wider">Anécdotas</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <a href="#process" className="px-6 py-3 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900 transition-all font-bold uppercase tracking-widest text-xs rounded-lg inline-block">
                                Conocer el Proceso
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
