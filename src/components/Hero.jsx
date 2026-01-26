import { useRef, useEffect } from "react";
import Icon from "./Icon";
import logoMedalla from '/assets/img/ui/logo_medalla.webp';

const Hero = () => {

    // Generador de burbujas aleatorias (CSS puro en index.css)
    // Renderizamos divs vacíos que serán animados por CSS
    const bubbles = Array.from({ length: 20 }).map((_, i) => ({
        size: Math.random() * 15 + 5, // 5px a 20px
        left: Math.random() * 100, // 0% a 100%
        duration: Math.random() * 10 + 5, // 5s a 15s
        delay: Math.random() * 5, // 0s a 5s
        opacity: Math.random() * 0.5 + 0.1
    }));

    return (
        <section id="home" className="h-[100dvh] w-full relative flex items-center justify-center overflow-hidden bg-slate-950">

            {/* Dynamic Bubbles Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {bubbles.map((b, i) => (
                    <div
                        key={i}
                        className="bubble absolute bottom-[-50px] bg-amber-500 rounded-full"
                        style={{
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            left: `${b.left}%`,
                            opacity: b.opacity,
                            animation: `floatUp ${b.duration}s linear infinite`,
                            animationDelay: `${b.delay}s`
                        }}
                    ></div>
                ))}
            </div>

            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay z-0"
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/img/backgrounds/bg_2.webp)` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900 z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(15,23,42,0.9)_100%)] z-10"></div>

            <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-7xl mx-auto">

                    {/* Left: Logo (Centered on Desktop) */}
                    <div className="flex justify-center lg:justify-center animate-fadeIn order-1">
                        <img
                            src={logoMedalla}
                            alt="Medalla Brewing"
                            fetchpriority="high"
                            className="w-48 md:w-64 lg:w-[450px] object-contain drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-105 transition-transform duration-700 filter brightness-110"
                        />
                    </div>

                    {/* Right: Content (Left aligned on Desktop) */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2">
                        <span className="text-amber-500 font-bold tracking-[0.5em] text-xs md:text-sm animate-fadeIn mb-6 uppercase border border-amber-500/30 px-4 py-1 rounded-full bg-amber-500/10 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            Cerveza Artesanal • Freyre
                        </span>

                        <p className="text-2xl md:text-4xl lg:text-5xl text-slate-200 mb-10 font-light leading-relaxed animate-slideUp">
                            Una Medalla como <br /> reconocimiento al <span className="text-amber-500 font-bold brand-font">Valor</span>.
                        </p>

                        <p className="text-l md:text-2xl lg:text-2xl text-slate-200 mb-10 font-light leading-relaxed animate-slideUp">
                            Por esas travesías que demuestran <br /> que si puede el que lo intenta.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 animate-slideUp w-full sm:w-auto items-center justify-center lg:justify-start" style={{ animationDelay: '0.2s' }}>
                            <a href="#beers" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                                <Icon name="Beer" size={20} /> Descubrir Estilos
                            </a>
                            <a href="#locator" className="px-8 py-4 bg-transparent border border-white/20 hover:border-white text-white font-bold rounded-full transition-all hover:bg-white/5 backdrop-blur-sm flex items-center justify-center gap-2 uppercase tracking-widest text-sm group">
                                <Icon name="MapPin" size={20} className="text-amber-500 group-hover:text-white transition-colors" /> Dónde Encontrarnos
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20 text-slate-500 opacity-50">
                <Icon name="ChevronDown" size={32} />
            </div>
        </section>
    );
};

export default Hero;
