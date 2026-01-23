import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import BeerCatalog from '../components/BeerCatalog';
import TheProcess from '../components/TheProcess';
import KegRentals from '../components/KegRentals';
import BeerFinder from '../components/BeerFinder';
import EventsSchedule from '../components/EventsSchedule';
import InfoSection from '../components/InfoSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <main>
            <Navbar />
            <Hero />
            <AboutUs />
            <BeerCatalog />
            <TheProcess />
            <KegRentals />
            <BeerFinder />
            <EventsSchedule />
            <InfoSection />
            <Footer />
        </main>
    );
};

export default Home;
