

const AgeGate = ({ onVerify }) => {
    const handleDeny = () => {
        window.location.href = "https://www.google.com";
    };

    const logoUrl = "/logo_medalla.png";

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950">
            <div className="absolute inset-0 bg-black/80"></div>

            <div className="relative z-10 max-w-md w-full p-8 text-center">
                <div className="mb-8">
                    <img src={logoUrl} alt="Logo Medalla" className="w-40 h-40 mx-auto object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 brand-font">CERVECERÍA <span className="gold-text">MEDALLA</span></h2>
                <p className="text-slate-400 mb-8">El sabor de la victoria se disfruta con responsabilidad.</p>
                <h3 className="text-xl text-white font-bold mb-8">¿SOS MAYOR DE 18 AÑOS?</h3>
                <div className="flex flex-col gap-4">
                    <button onClick={onVerify} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-sm uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer">SÍ, ENTRAR</button>
                    <button onClick={handleDeny} className="w-full bg-transparent border border-slate-700 text-slate-500 hover:text-white font-bold py-4 rounded-sm uppercase tracking-widest transition-colors cursor-pointer">NO, SALIR</button>
                </div>
            </div>
        </div>
    );
};

export default AgeGate;
