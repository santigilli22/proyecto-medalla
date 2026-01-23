import { useState, useEffect } from "react";
import Icon from "./Icon";

const ScrollProgressBeer = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [isFull, setIsFull] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;

            const totalScroll = documentHeight - windowHeight;
            const currentProgress = (scrollTop / totalScroll) * 100;

            const clampedProgress = Math.min(Math.max(currentProgress, 0), 100);
            setScrollPercentage(clampedProgress);
            setIsFull(clampedProgress > 98);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed bottom-6 left-6 z-40 transition-opacity duration-500 ${scrollPercentage > 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

            {/* Container / Tooltip Wrapper */}
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>

                {/* Tooltip (Cheers!) */}
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-lg transform transition-all duration-300 ${isFull ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-4'}`}>
                    ¡SALUD! 🍻
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45"></div>
                </div>

                {/* The Glass */}
                <div className="w-10 h-16 border-2 border-slate-600 rounded-b-lg rounded-t-sm bg-slate-900/50 backdrop-blur-sm relative overflow-hidden shadow-lg group-hover:border-amber-500/50 transition-colors">

                    {/* Liquid */}
                    <div
                        className="absolute bottom-0 left-0 w-full bg-amber-500 transition-all duration-100 ease-out flex items-start justify-center overflow-hidden"
                        style={{ height: `${scrollPercentage}%` }}
                    >
                        {/* Bubbles in liquid */}
                        <div className="absolute bottom-0 w-full h-full opacity-50">
                            <div className="absolute bottom-1 left-2 w-1 h-1 bg-white/50 rounded-full animate-float" style={{ animationDuration: '2s' }}></div>
                            <div className="absolute bottom-3 right-2 w-0.5 h-0.5 bg-white/50 rounded-full animate-float" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute bottom-6 left-4 w-1 h-1 bg-white/50 rounded-full animate-float" style={{ animationDuration: '4s' }}></div>
                        </div>

                        {/* Foam Head (Visible only when overflowing/full or always on top of liquid?) */}
                        {/* Head appears at the top of liquid */}
                        <div className="w-full h-1 bg-white/90 absolute top-0 left-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    </div>

                    {/* Glass Highlights (CSS Overlay) */}
                    <div className="absolute inset-0 rounded-b-lg pointer-events-none shadow-[inset_0_0_5px_rgba(255,255,255,0.1)]"></div>
                    <div className="absolute top-2 right-1 w-0.5 h-10 bg-white/10 rounded-full"></div>

                </div>

                {/* Percentage Label (Optional, maybe hidden on mobile) */}
                {/* <div className="absolute -right-8 bottom-0 text-[10px] text-slate-500 font-mono hidden md:block">
            {Math.round(scrollPercentage)}%
        </div> */}

                {/* Return to Top Icon (shows on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Icon name="ArrowUp" size={20} className="text-white drop-shadow-md" />
                </div>

            </div>
        </div>
    );
};

export default ScrollProgressBeer;
