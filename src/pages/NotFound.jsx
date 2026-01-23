import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-20">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
                <h1 className="relative text-9xl font-bold brand-font text-slate-800 select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold border-2 border-amber-500 text-amber-500 px-4 py-2 rounded -rotate-12 bg-slate-900/80 backdrop-blur-sm shadow-xl">
                        BARRIL VACÍO
                    </span>
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ¡Te fuiste de mambo!
            </h2>
            <p className="text-slate-400 max-w-md mb-8 text-lg">
                La página que estás buscando ya se la tomaron. Mejor volvé a la barra antes de que cierren.
            </p>

            <Link
                to="/"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-sm uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
            >
                Volver al Inicio
            </Link>
        </div>
    );
};

export default NotFound;
