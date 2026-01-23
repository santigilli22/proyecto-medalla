import { useState } from 'react';
import Icon from './Icon';
import ModalPortal from './ui/ModalPortal';
import { beersData } from '../data/beers';

const BeerCatalog = () => {
    const [selected, setSelected] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelected(null);
            setIsClosing(false);
        }, 300);
    };

    return (
        // SECCION: Ocupa exactamente el alto de la pantalla (100dvh) en desktop para "amoldarse" y no scrollear
        <section id="beers" className="bg-slate-900 content-section reveal h-[100dvh] flex flex-col pt-20 md:pt-24 pb-4 md:pb-8 overflow-hidden relative">

            {/* Contenedor flexible verticalmente - Full Width */}
            <div className="h-full flex flex-col w-full">

                {/* Header: Con container para alinear con el resto de la web */}
                <div className="container mx-auto px-4 md:px-6 flex items-center gap-4 mb-4 md:mb-6 shrink-0 z-10 relative">
                    <div className="h-1 w-8 md:w-16 bg-amber-500 shrink-0"></div>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white whitespace-nowrap brand-font tracking-wide">NUESTRAS VARIEDADES</h2>
                </div>

                {/* 
                   GRID PRINCIPAL: 
                   - Flex-1 para ocupar TODO el resto del alto disponible.
                   - Grid de 6 columnas en desktop (lg) para verlas "Todas juntas".
                */}
                <div className="flex-1 min-h-0 relative h-full w-full">
                    {/* 
                        SCROLL CONTAINER:
                        - Flex continuo.
                        - Snap mandatory.
                    */}
                    <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory items-stretch no-scrollbar lg:relative lg:grid lg:grid-cols-6 lg:overflow-visible lg:snap-none">

                        {beersData.map((beer) => (
                            <div
                                key={beer.id}
                                className="
                                    snap-center shrink-0 flex flex-col h-full relative group items-center justify-end
                                    min-w-full md:min-w-[50%] lg:min-w-0 lg:w-auto
                                    lg:cursor-pointer
                                "
                                onClick={() => setSelected(beer)}
                            >

                                {/* IMAGEN LATA */}
                                <div className="relative w-full flex-1 min-h-0 flex items-end justify-center mb-0 pointer-events-none px-4 lg:px-0 transition-transform duration-500 lg:group-hover:scale-105">
                                    <picture className="h-full w-full flex justify-center items-end relative z-10">
                                        <img
                                            src={beer.img}
                                            alt={beer.name}
                                            className="h-full w-auto object-contain max-h-full"
                                            loading="lazy"
                                        />
                                    </picture>
                                </div>



                            </div>
                        ))}

                    </div>
                </div>

            </div>

            {selected && (
                <ModalPortal>
                    <div
                        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
                        onClick={handleClose}
                    >
                        <div className="relative max-w-6xl w-full h-full max-h-screen flex justify-center items-center p-4 pointer-events-none" onClick={e => e.stopPropagation()}>
                            <div className="pointer-events-auto relative">
                                <button onClick={handleClose} aria-label="Cerrar detalle" className="absolute top-4 right-4 z-50 p-3 bg-slate-800 hover:bg-amber-600 rounded-full text-white transition-colors cursor-pointer shadow-xl border border-white/10">
                                    <Icon name="X" size={24} />
                                </button>
                                <picture className="contents">
                                    <img
                                        src={selected.detailImg}
                                        alt={`Detalle ${selected.name}`}
                                        className={`max-h-[90vh] md:max-h-[95vh] w-auto object-contain drop-shadow-2xl ${isClosing ? 'animate-zoomOut' : 'animate-zoomIn'}`}
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </section>
    );
};

export default BeerCatalog;
