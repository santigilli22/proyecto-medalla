import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineNotice = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-amber-500 text-slate-900 px-4 py-3 shadow-[0_-4px_20px_rgba(251,191,36,0.3)] animate-floatUp" style={{ animation: 'none' }}>
            <div className="container mx-auto flex items-center justify-center gap-3">
                <WifiOff className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider text-sm md:text-base">
                    ¡SE CORTÓ EL CHORRO! REVISÁ TU CONEXIÓN A INTERNET.
                </span>
            </div>
        </div>
    );
};

export default OfflineNotice;
