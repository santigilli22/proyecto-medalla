import { Wrench } from 'lucide-react';

const Maintenance = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-20">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full"></div>
                <Wrench className="w-24 h-24 text-slate-600 animate-pulse relative z-10" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold brand-font text-white mb-2">503</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-6 uppercase tracking-widest">
                LIMPIEZA DE CHOPERAS
            </h2>

            <p className="text-slate-400 max-w-lg mb-8 text-lg">
                Estamos haciendo mantenimiento para asegurar que la cerveza salga siempre helada.
                <br />
                <span className="text-amber-500 font-bold block mt-2">Volvemos en unos minutos.</span>
            </p>

            <div className="flex gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};

export default Maintenance;
