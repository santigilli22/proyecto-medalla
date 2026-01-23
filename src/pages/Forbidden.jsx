import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-20">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"></div>
                <div className="relative bg-slate-800 p-6 rounded-full border-4 border-slate-700 shadow-xl">
                    <Lock className="w-16 h-16 text-amber-500" />
                </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold brand-font text-white mb-2">403</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-6 uppercase tracking-widest border-y-2 border-amber-500 py-2 inline-block">
                ZONA RESTRINGIDA
            </h2>

            <p className="text-slate-400 max-w-md mb-8 text-lg">
                ¡Alto ahí! Esta área es exclusiva para el <strong>Maestro Cervecero</strong>.
                Si no tenés la llave maestra, mejor volvete a la barra.
            </p>

            <Link
                to="/"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest transition-all hover:scale-105"
            >
                Volver a la Barra
            </Link>
        </div>
    );
};

export default Forbidden;
