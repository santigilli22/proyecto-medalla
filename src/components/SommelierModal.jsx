import { useState } from 'react';
import Icon from './Icon';
import ModalPortal from './ui/ModalPortal';
import { beersData } from '../data/beers';

const SommelierModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const questions = [
        {
            id: 'intensity',
            icon: 'Zap',
            text: "¿Qué buscas hoy?",
            options: [
                { label: "Refrescante y Ligera", val: 'light', icon: 'Wheat' },
                { label: "Intensa y Con Cuerpo", val: 'heavy', icon: 'Beer' }
            ]
        },
        {
            id: 'bitterness',
            icon: 'Flower2', // Usando icono genérico o mapeado si existe
            text: "¿Nivel de Amargor?",
            options: [
                { label: "Bajo / Sutil", val: 'low', icon: 'Minus' },
                { label: "Alto / Lupulado", val: 'high', icon: 'Plus' }
            ]
        },
        {
            id: 'sweetness',
            icon: 'Candy',
            text: "¿Toque Dulce?",
            options: [
                { label: "Sí, me gusta", val: 'sweet', icon: 'CheckCircle' },
                { label: "No, prefiero seco", val: 'dry', icon: 'X' }
            ]
        },
        {
            id: 'color',
            icon: 'Palette',
            text: "¿Preferencia Visual?",
            options: [
                { label: "Rubias / Doradas", val: 'blonde', icon: 'Sun' },
                { label: "Rojas / Oscuras", val: 'dark', icon: 'Moon' }
            ]
        }
    ];

    const handleAnswer = (key, val) => {
        const newAnswers = { ...answers, [key]: val };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Lógica de recomendación simple
            let matchId = 1;
            // ... (Lógica igual que antes, simplificada visualmente)
            if (newAnswers.bitterness === 'high') {
                if (newAnswers.color === 'dark' || newAnswers.intensity === 'heavy') matchId = 3; // Red IPA / Rock IPA logic approx
                else matchId = 4;
            } else {
                if (newAnswers.color === 'blonde') {
                    if (newAnswers.sweetness === 'sweet') matchId = 2; // Honey
                    else matchId = 1; // Golden
                } else {
                    if (newAnswers.sweetness === 'sweet' || newAnswers.intensity === 'heavy') matchId = 5; // Scottish
                    else matchId = 6; // Stout
                }
            }
            // Mapeo manual rápido para demo o usar lógica real si es compleja
            // Usamos lógica real aproximada arriba
            setResult(beersData.find(b => b.id === matchId) || beersData[0]);
        }
    };

    const reset = () => { setStep(0); setAnswers({}); setResult(null); };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn" onClick={onClose}>

                <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>

                    {/* Header */}
                    <div className="bg-slate-800/50 p-6 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                                <Icon name="BrainCircuit" size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-white tracking-wide brand-font text-lg">SOMMELIER <span className="text-amber-500">IA</span></h2>
                                <p className="text-xs text-slate-400">Asistente Virtual</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[400px] flex flex-col justify-center relative">
                        {/* Background Deco */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.05),_transparent_70%)] pointer-events-none"></div>

                        {!result ? (
                            <div className="animate-slideUp flex flex-col items-center w-full">
                                {/* Progress Bar */}
                                <div className="w-full flex gap-2 mb-8 justify-center">
                                    {questions.map((_, i) => (
                                        <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= i ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-bold text-white text-center mb-8">{questions[step].text}</h3>

                                <div className="grid grid-cols-1 gap-4 w-full">
                                    {questions[step].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(questions[step].id, opt.val)}
                                            className="group relative flex items-center justify-between p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-amber-500 hover:bg-slate-800 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] active:scale-[0.98]"
                                        >
                                            <span className="text-lg font-medium text-slate-200 group-hover:text-white">{opt.label}</span>
                                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                                                <Icon name="ChevronRight" size={20} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-zoomIn text-center flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center p-1 shadow-[0_0_40px_rgba(245,158,11,0.4)] mb-6 animate-float">
                                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-amber-400/50">
                                        <Icon name="Award" size={32} className="text-amber-500" />
                                    </div>
                                </div>

                                <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Tu Cerveza Ideal es</p>
                                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 brand-font leading-none">{result.name}</h3>

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-8 w-full max-w-xs mx-auto">
                                    <p className="text-slate-300 text-sm leading-relaxed">{result.description || "Una elección perfecta basada en tus gustos."}</p>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button onClick={reset} className="flex-1 py-4 text-slate-400 font-bold hover:text-white transition-colors border-b-2 border-transparent hover:border-white/20">
                                        Reintentar
                                    </button>
                                    <button onClick={() => { onClose(); window.location.href = '#beers'; }} className="flex-[2] py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-1">
                                        VER DETALLES
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
};

export default SommelierModal;
