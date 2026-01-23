import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

const ProcessStep = ({ step, index, isActive, toggleStep }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`relative flex flex-col w-full mb-4 lg:mb-32 lg:flex-row lg:items-center lg:justify-between lg:gap-0 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

            {/* MOBILE HEADER (Always Visible on Mobile) */}
            <button
                onClick={toggleStep}
                className={`lg:hidden w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 mb-2 z-20 relative bg-slate-900/80 backdrop-blur-md ${isActive ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-700 hover:border-slate-500'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon name={step.icon} size={20} />
                    </div>
                    <div className="text-left">
                        <span className="text-xs text-amber-500 font-mono font-bold block">PASO 0{index + 1}</span>
                        <h3 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>{step.title}</h3>
                    </div>
                </div>
                <div className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-amber-500' : 'text-slate-500'}`}>
                    <Icon name="ArrowUp" size={20} />
                </div>
            </button>


            {/* DESKTOP & MOBILE CONTENT WRAPPER */}
            <div className={`
                w-full transition-all duration-500 ease-in-out overflow-hidden
                lg:w-5/12 lg:h-auto lg:opacity-100 lg:overflow-visible lg:block
                ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none'}
            `}>

                {/* 1. Content Card */}
                <div className={`relative group z-10 ${isEven ? 'lg:text-left' : 'lg:text-right'}`}>
                    <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-xl group-hover:bg-amber-500/20 transition-all opacity-0 group-hover:opacity-100 duration-500 hidden lg:block"></div>
                    <div className="relative bg-slate-900/40 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-slate-700 lg:hover:border-amber-500/50 transition-all lg:hover:transform lg:hover:-translate-y-1 lg:hover:shadow-2xl">
                        {/* Desktop Number */}
                        <span className="hidden lg:block text-6xl md:text-8xl font-bold text-white/5 absolute -top-10 -right-4 font-mono select-none pointer-events-none">0{index + 1}</span>

                        {/* Desktop Icon */}
                        <div className={`hidden lg:inline-flex mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-600 text-amber-500 shadow-inner ${isEven ? '' : 'lg:ml-auto'}`}>
                            <Icon name={step.icon} size={28} />
                        </div>

                        {/* Desktop Title */}
                        <h3 className="hidden lg:block text-2xl lg:text-3xl font-bold text-white mb-3 brand-font">{step.title}</h3>

                        <p className="text-slate-300 leading-relaxed text-sm lg:text-base font-light">{step.desc}</p>
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">El Secreto</span>
                            <span className="text-amber-400 font-medium text-sm">{step.secret}</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Image (Inside Content Wrapper) */}
                <div className="lg:hidden mt-4 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                    <img src={step.image} alt={step.title} className="w-full h-48 object-cover object-center" />
                </div>

            </div>

            {/* 2. Center Line & Node (Desktop Only) */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full hidden lg:flex flex-col items-center justify-center top-0 pointer-events-none">
                <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)] z-20 relative transition-transform duration-500 hover:scale-150">
                    <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                </div>
            </div>

            {/* 3. Image Card (Desktop Only) */}
            <div className="hidden lg:block w-full lg:w-5/12 relative group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 group-hover:border-amber-500/50 transition-all duration-500 transform hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-amber-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                    <div className="aspect-video lg:h-64 w-full relative">
                        <img
                            src={step.image}
                            alt={step.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover filter brightness-75 contrast-110 group-hover:brightness-100 transition-all duration-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TheProcess = () => {
    const [activeStepMobile, setActiveStepMobile] = useState(null);

    const toggleStep = (index) => {
        setActiveStepMobile(prev => prev === index ? null : index);
    };

    const steps = [
        {
            title: "Molienda del Grano",
            icon: "Wheat",
            desc: "Nuestra jornada comienza seleccionando las mejores maltas. En el molino, rompemos el grano con precisión milimétrica: buscamos exponer el almidón sin destrozar la cáscara, que será nuestro filtro natural más adelante.",
            secret: "Punto justo de ruptura para un filtrado cristalino.",
            image: "/process/molienda.png"
        },
        {
            title: "Maceración",
            icon: "Thermometer",
            desc: "En el macerador, mezclamos la malta molida con agua caliente tratada. Aquí activamos las enzimas naturales que convierten los almidones en azúcares fermentables. Es un proceso de paciencia y temperatura controlada.",
            secret: "Control de temperatura escalonado para cuerpo y sabor.",
            image: "/process/maceracion.png"
        },
        {
            title: "Hervor y Lupulado",
            icon: "Flame",
            desc: "Llevamos el mosto a ebullición vigorosa. Este es el momento donde definimos el carácter: agregamos lúpulos en diferentes tiempos para aportar amargor, sabor y esos aromas únicos que distinguen a cada estilo Medalla.",
            secret: "Adiciones tardías para una explosión aromática.",
            image: "/process/hervor.png"
        },
        {
            title: "Fermentación",
            icon: "FlaskConical",
            desc: "Enfriamos el mosto rápidamente y lo pasamos a los fermentadores. Sembramos nuestra levadura, que trabajará incansablemente transformando azúcares en alcohol y CO2, creando el perfil sensorial definitivo.",
            secret: "Levaduras sanas y temperaturas precisas.",
            image: "/process/fermentacion.png"
        },
        {
            title: "Maduración en Frío",
            icon: "Clock",
            desc: "Una vez fermentada, bajamos la temperatura drásticamente. La cerveza descansa, madura y se clarifica naturalmente. Los sabores se redondean y se integran, eliminando cualquier arista no deseada.",
            secret: "Tiempo y paciencia, sin acelerar procesos.",
            image: "/process/maduracion.png"
        },
        {
            title: "Embarrilado",
            icon: "Package",
            desc: "Finalmente, filtramos (o no, según el estilo) y envasamos en barriles y latas bajo condiciones estrictas para evitar el oxígeno. Así aseguramos que la frescura de la fábrica llegue intacta a tu mano.",
            secret: "Cadena de frío y purga de CO2 constante.",
            image: "/process/embarrilado.png"
        }
    ];

    return (
        <section id="process" className="bg-slate-950 relative overflow-hidden content-section pt-24 pb-24 min-h-screen">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-transparent to-slate-950 z-0"></div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Intro Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 animate-fadeIn">
                    <div className="inline-block p-3 rounded-full bg-slate-800/50 border border-slate-700 mb-6 backdrop-blur animate-float">
                        <Icon name="Factory" size={32} className="text-amber-500" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 brand-font tracking-wide">EL RECORRIDO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">MEDALLA</span></h2>
                    <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
                        Conocé nuestra fábrica por dentro. Así transformamos ingredientes nobles en la cerveza que amás, paso a paso, sin atajos.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-6xl mx-auto">

                    {/* The Golden Thread (Desktop Only) */}
                    <div className="absolute left-8 lg:left-1/2 top-4 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0 lg:-translate-x-1/2 z-0 hidden lg:block"></div>

                    {/* Steps */}
                    <div className="flex flex-col max-w-2xl mx-auto lg:max-w-none">
                        {steps.map((step, idx) => (
                            <ProcessStep
                                key={idx}
                                step={step}
                                index={idx}
                                isActive={activeStepMobile === idx}
                                toggleStep={() => toggleStep(idx)}
                            />
                        ))}
                    </div>

                    {/* Final CTA Node */}
                    <div className="flex justify-center mt-8 relative z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center animate-pulse">
                                <Icon name="CheckCircle" size={24} className="text-slate-900" />
                            </div>
                            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">¡Lista para disfrutar!</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TheProcess;
