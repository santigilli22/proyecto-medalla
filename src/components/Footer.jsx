import Icon from './Icon';

const Footer = () => {
    const BASE = import.meta.env.BASE_URL;
    const logoUrl = `${BASE}logo_medalla.png`;

    return (
        <footer id="footer" className="bg-black text-slate-400 font-light border-t border-amber-900/40 relative overflow-hidden flex items-center justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/30 via-black to-black pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 w-full py-12 lg:py-16">

                {/* Simplified Bottom Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-0">

                    {/* Left: Logo & Copyright */}
                    <div className="flex items-center gap-5 relative z-10 justify-center lg:justify-start text-left">
                        <img src={logoUrl} alt="Medalla Logo" className="h-12 w-12 md:h-14 md:w-14 object-contain opacity-80 hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex flex-col text-xs md:text-sm uppercase tracking-widest text-slate-500 leading-snug font-medium">
                            <span className="text-slate-400 font-bold">&copy; {new Date().getFullYear()} Cervecería Medalla</span>
                            <span>Todos los derechos reservados</span>
                        </div>
                    </div>

                    {/* Right: Legal Warnings */}
                    <div className="flex flex-col lg:flex-row items-center lg:gap-2 text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-amber-600/90 select-none text-center lg:text-right">
                        <span className="drop-shadow-sm whitespace-nowrap">Beber con moderación</span>
                        <span className="hidden lg:inline text-amber-900/40 mx-2">|</span>
                        <span className="opacity-70 whitespace-nowrap">Prohibida su venta a menores de 18 años</span>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
