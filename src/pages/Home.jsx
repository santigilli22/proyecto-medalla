import { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import Icon from '../components/Icon';

// Lazy load below-the-fold components to reduce initial bundle size
const BeerCatalog = lazy(() => import('../components/BeerCatalog'));
const TheProcess = lazy(() => import('../components/TheProcess'));
const KegRentals = lazy(() => import('../components/KegRentals'));
const BeerFinder = lazy(() => import('../components/BeerFinder'));
const EventsSchedule = lazy(() => import('../components/EventsSchedule'));
const InfoSection = lazy(() => import('../components/InfoSection'));

// Simple loading placeholder for sections
const SectionLoader = () => (
    <div className="w-full h-96 flex items-center justify-center bg-slate-950">
        <Icon name="Loader2" size={32} className="text-amber-500 animate-spin" />
    </div>
);

const Home = () => {
    return (
        <main>
            <Navbar />
            <Hero />
            <AboutUs />

            <Suspense fallback={<SectionLoader />}>
                <BeerCatalog />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <TheProcess />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <KegRentals />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <BeerFinder />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <EventsSchedule />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
                <InfoSection />
            </Suspense>

            <Footer />
        </main>
    );
};

export default Home;
