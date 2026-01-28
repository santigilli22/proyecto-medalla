import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icons in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const PartnersMap = ({ partners, onMarkerClick }) => {

    // Helper to get coordinates regardless of format (API or Legacy)
    const getCoords = (p) => {
        if (p.location && p.location.coordinates) {
            // GeoJSON is [lng, lat]
            return [p.location.coordinates[1], p.location.coordinates[0]];
        }
        return [p.lat, p.lng];
    };

    // Default center (Córdoba region approx) or calculated from first partner
    const defaultCenter = partners.length > 0
        ? getCoords(partners[0])
        : [-31.4201, -64.1888];

    return (
        <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative z-10">
            <MapContainer
                center={defaultCenter}
                zoom={8}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {partners.map((partner, idx) => {
                    const customIcon = L.divIcon({
                        className: 'custom-maker',
                        html: `<div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-500 overflow-hidden shadow-lg relative">
                                <img src="${partner.logo || import.meta.env.BASE_URL + 'assets/img/ui/logo_medalla.webp'}" class="w-full h-full object-cover" />
                                <div class="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-500"></div>
                              </div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 48],
                        popupAnchor: [0, -48]
                    });

                    return (
                        <Marker
                            key={idx}
                            position={getCoords(partner)}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => onMarkerClick && onMarkerClick(partner)
                            }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default PartnersMap;
