import Icon from './Icon';

const SommelierButton = ({ onOpen, hidden }) => (
    <div className={`fixed bottom-6 right-6 z-[90] flex items-center justify-center group transition-opacity duration-300 ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

        {/* Tooltip */}
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none">
            Sommelier IA
        </span>

        <button
            onClick={onOpen}
            aria-label="Abrir Sommelier IA"
            className="
                relative
                w-16 h-16 
                rounded-full 
                bg-gradient-to-tr from-amber-600 to-amber-400
                text-slate-900 
                shadow-[0_0_20px_rgba(245,158,11,0.5)] 
                hover:shadow-[0_0_30px_rgba(245,158,11,0.8)]
                border-2 border-white/20
                flex items-center justify-center 
                transition-all duration-300 
                transform hover:scale-110 active:scale-95
                animate-float
            "
        >
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <Icon name="BrainCircuit" size={32} className="text-slate-900 drop-shadow-sm" />
        </button>
    </div>
);

export default SommelierButton;
