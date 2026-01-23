import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

const MobileMenuPortal = ({ children }) => {
    if (typeof document === 'undefined') return null;
    return createPortal(children, document.body);
};


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const logoUrl = "/logo_medalla.png";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none'; // Prevenir scroll táctil extra
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'NOSOTROS', id: '#about' },
        { name: 'CERVEZAS', id: '#beers' },
        { name: 'EL RITUAL', id: '#process' },
        { name: 'BARRILES', id: '#kegs' },
        { name: 'DÓNDE', id: '#locator' },
        { name: 'EVENTOS', id: '#events' },
        { name: 'FAQ', id: '#faq' },
    ];

    return (
        <>
            {/* MAIN NAVBAR */}
            <nav className={`fixed w-full z-[1100] transition-all duration-300 ${scrolled || isOpen ? 'bg-slate-900/95 shadow-lg py-2 backdrop-blur-md' : 'bg-transparent py-4'}`}>
                <div className="w-full px-6 flex justify-between items-center gap-4 relative">
                    <a
                        href="#home"
                        onClick={() => setIsOpen(false)}
                        className={`text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3 brand-font text-amber-500 hover:opacity-90 transition-all duration-500 whitespace-nowrap ${scrolled || isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}`}
                    >
                        <img src={logoUrl} alt="Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
                        MEDALLA
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex gap-4 xl:gap-8 font-medium text-xs xl:text-sm tracking-widest flex-shrink-0 items-center">
                        {navLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.id}
                                className="hover:text-amber-500 transition-colors cursor-pointer whitespace-nowrap text-white"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                        <button
                            className="lg:hidden text-white cursor-pointer p-2 z-[1100] relative"
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Icon name={isOpen ? "X" : "Menu"} size={32} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-amber-500' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* FULL SCREEN MOBILE OVERLAY (PORTAL) */}
            <MobileMenuPortal>
                <div
                    className={`fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-[1050] transition-all duration-500 flex flex-col items-center justify-center lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsOpen(false)}
                >
                    {/* Background Texture for Detail */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                    <div className="flex flex-col items-center gap-6 text-lg tracking-[0.2em] font-bold z-10" onClick={(e) => e.stopPropagation()}>
                        {navLinks.map((link, idx) => (
                            <a
                                key={link.name}
                                href={link.id}
                                onClick={() => setIsOpen(false)}
                                className={`text-white hover:text-amber-500 transition-all cursor-pointer transform duration-300 ${isOpen ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-10 opacity-0 blur-sm'}`}
                                style={{ transitionDelay: `${isOpen ? idx * 80 : 0}ms` }}
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="w-8 h-px bg-amber-500/30 my-6 rounded-full"></div>

                        <div className={`flex gap-6 transition-all duration-700 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                            <a href="https://www.instagram.com/medallacerveza/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-500 transform hover:scale-125 transition-transform"><Icon name="Instagram" size={24} /></a>
                            <a href="https://www.facebook.com/medallacerveza" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-500 transform hover:scale-125 transition-transform"><Icon name="Facebook" size={24} /></a>
                        </div>
                    </div>
                </div>
            </MobileMenuPortal>
        </>
    );
};

export default Navbar;
