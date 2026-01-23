import Icon from './Icon';

const Footer = () => {
    const logoUrl = "/logo_medalla.png";

    return (
        <footer id="footer" className="relative bg-black text-slate-300 font-light pt-24 pb-16 overflow-hidden reveal border-t border-amber-900/30">
            {/* Elegant Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-60"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-16 md:gap-8 mb-24 text-center">

                    {/* 1. BRAND IDENTITY */}
                    <div className="flex-1 flex flex-col items-center space-y-6">
                        <a href="#home" className="group flex flex-col items-center gap-4">
                            <img src={logoUrl} alt="Medalla Logo" className="h-20 w-20 grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100" />
                            <span className="text-3xl font-bold text-white brand-font tracking-[0.25em] group-hover:text-amber-500 transition-colors">MEDALLA</span>
                        </a>
                        <p className="text-lg leading-8 text-slate-400 max-w-sm mx-auto font-serif italic antialiased">
                            "Honrando la tradición cervecera con cada pinta. Elaborada con pasión en Freyre, Córdoba."
                        </p>
                        <div className="flex gap-6 pt-4 justify-center">
                            <a href="https://www.facebook.com/medallacerveza" target="_blank" rel="noopener noreferrer" className="p-4 bg-zinc-900 rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300 group border border-zinc-800 hover:scale-110">
                                <Icon name="Facebook" size={24} />
                            </a>
                            <a href="https://www.instagram.com/medallacerveza/" target="_blank" rel="noopener noreferrer" className="p-4 bg-zinc-900 rounded-full hover:bg-pink-700 hover:text-white transition-all duration-300 group border border-zinc-800 hover:scale-110">
                                <Icon name="Instagram" size={24} />
                            </a>
                        </div>
                    </div>

                    {/* 2. CONTACT INFO */}
                    <div className="flex-1 flex flex-col items-center space-y-8">
                        <h4 className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm border-b border-amber-500/30 pb-3 px-8">Visitanos</h4>
                        <ul className="space-y-6 text-base md:text-lg font-normal">
                            <li className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="text-amber-600 mb-1 group-hover:scale-110 transition-transform"><Icon name="MapPin" size={28} /></div>
                                <span className="text-white font-medium tracking-wide">Medalla Bar</span>
                                <span className="text-slate-500">Bv. 25 de Mayo 903, Freyre</span>
                            </li>
                            <li className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="text-amber-600 mb-1 group-hover:scale-110 transition-transform"><Icon name="Phone" size={28} /></div>
                                <span className="text-slate-400 hover:text-white transition-colors tracking-widest">+54 3564 638157</span>
                            </li>
                            <li className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="text-amber-600 mb-1 group-hover:scale-110 transition-transform"><Icon name="Clock" size={28} /></div>
                                <span className="text-slate-500">Jueves a Domingo</span>
                                <span className="text-white font-medium">19:00 - 03:00</span>
                            </li>
                        </ul>
                    </div>

                    {/* 3. NEWSLETTER */}
                    <div className="flex-1 flex flex-col items-center w-full space-y-8">
                        <h4 className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm border-b border-amber-500/30 pb-3 px-8">Novedades</h4>
                        <p className="text-base text-slate-400 text-center max-w-xs leading-relaxed">
                            Suscribite para enterarte primero de nuestros <span className="text-amber-500">eventos</span> y <span className="text-amber-500">lanzamientos</span>.
                        </p>
                        <form className="w-full relative max-w-xs mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="TU EMAIL"
                                className="w-full bg-transparent border-b-2 border-slate-800 py-4 px-4 text-center text-base focus:outline-none focus:border-amber-500 transition-all text-white placeholder-slate-700 tracking-widest uppercase"
                            />
                            <button className="w-full mt-6 bg-slate-900 hover:bg-amber-600 text-slate-300 hover:text-white py-3 rounded uppercase text-xs font-bold tracking-[0.2em] transition-all duration-300 border border-slate-800">
                                Unirse
                            </button>
                        </form>
                    </div>

                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-slate-900 pt-10 flex flex-col items-center gap-6 text-sm text-slate-600 tracking-widest">
                    <p className="text-center">&copy; {new Date().getFullYear()} CERVECERÍA MEDALLA. TODOS LOS DERECHOS RESERVADOS.</p>
                    <div className="px-6 py-3 bg-zinc-950/50 rounded-lg border border-zinc-900/50 text-amber-900/60 font-bold uppercase text-[11px] tracking-[0.2em] select-none text-center">
                        Beber con moderación. Prohibida su venta a menores.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
