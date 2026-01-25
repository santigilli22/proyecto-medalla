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
        { name: 'CERVEZAS', id: '#beers', hoverColor: 'hover:bg-yellow-500' },
        { name: 'NOSOTROS', id: '#about', hoverColor: 'hover:bg-orange-500' },
        { name: 'EL PROCESO', id: '#process', hoverColor: 'hover:bg-red-600' },
        { name: 'BARRILES', id: '#kegs', hoverColor: 'hover:bg-emerald-600' },
        { name: 'DÓNDE', id: '#locator', hoverColor: 'hover:bg-purple-600' },
        { name: 'EVENTOS', id: '#events', hoverColor: 'hover:bg-[#e07a5f]' },
        { name: 'FAQ', id: '#faq', hoverColor: 'hover:bg-slate-900' },
    ];

    return (
        <>
            {/* MAIN NAVBAR */}
            {/* MAIN NAVBAR */}
            <nav className={`fixed w-full z-[1100] transition-all duration-500 ease-in-out ${scrolled || isOpen ? 'translate-y-0 opacity-100 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 shadow-xl py-2 md:py-3 backdrop-blur-md' : '-translate-y-full opacity-0 pointer-events-none py-4 md:py-6'}`}>
                <div className="w-full px-8 md:px-12 lg:px-24 flex items-center relative">
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex w-full justify-between items-center font-bold text-xs xl:text-sm tracking-[0.2em]">
                        {navLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.id}
                                className={`text-slate-900 hover:text-white ${link.hoverColor} px-5 py-2 transition-all duration-300 cursor-pointer whitespace-nowrap rounded-tr-2xl rounded-bl-2xl hover:scale-105 shadow-sm hover:shadow-md`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 ml-auto lg:hidden">
                        <button
                            className="lg:hidden text-slate-900 cursor-pointer p-2 z-[1100] relative"
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Icon name={isOpen ? "X" : "Menu"} size={32} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-slate-900' : ''}`} />
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
