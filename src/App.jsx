import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useScrollReveal } from './hooks/useScrollReveal';

// UI & Overlays
import AgeGate from './components/AgeGate';
import SommelierButton from './components/SommelierButton';
import SommelierModal from './components/SommelierModal';
import ScrollProgressBeer from './components/ScrollProgressBeer';
import BubbleCursor from './components/BubbleCursor';
import OfflineNotice from './components/OfflineNotice';
import Icon from './components/Icon'; // Import Icon for the loader

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Forbidden = lazy(() => import('./pages/Forbidden'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
import ErrorBoundary from './components/ErrorBoundary';

// Loading Fallback Component
const PageLoader = () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-amber-500">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <Icon name="Beer" size={48} className="animate-bounce" />
            <span className="font-bold tracking-widest uppercase text-sm">Cargando...</span>
        </div>
    </div>
);

function App() {
    const [ageVerified, setAgeVerified] = useState(() => {
        try {
            const expiry = window.localStorage.getItem('medalla_age_verified_expiry');
            if (!expiry) return false;
            return new Date().getTime() < parseInt(expiry, 10);
        } catch (e) {
            return false;
        }
    });

    const handleVerify = () => {
        const expiry = new Date().getTime() + 60 * 60 * 1000; // 1 hour
        window.localStorage.setItem('medalla_age_verified_expiry', expiry.toString());
        setAgeVerified(true);
    };

    const [isSommelierOpen, setIsSommelierOpen] = useState(false);
    const [hideFloating, setHideFloating] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Hide if at top (Inicio/Hero) OR near bottom (Footer)
            const isAtTop = window.scrollY < window.innerHeight * 0.5;
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

            setHideFloating(isAtTop || scrolledToBottom);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useScrollReveal();

    return (
        <Router basename={import.meta.env.BASE_URL}>
            <ErrorBoundary>
                <div className="min-h-screen flex flex-col relative bg-slate-900 text-white">
                    <OfflineNotice />

                    {!ageVerified && <AgeGate onVerify={handleVerify} />}

                    {ageVerified && <SommelierButton onOpen={() => setIsSommelierOpen(true)} hidden={hideFloating} />}

                    <SommelierModal
                        isOpen={isSommelierOpen}
                        onClose={() => setIsSommelierOpen(false)}
                    />

                    <div className={`blur-transition transition-all duration-500 ${ageVerified ? "filter-none" : "blur-xl pointer-events-none h-screen overflow-hidden"}`}>
                        <BubbleCursor />
                        <ScrollProgressBeer hidden={hideFloating} />

                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/403" element={<Forbidden />} />
                                <Route path="/503" element={<Maintenance />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
