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
    // Default center (Córdoba region approx) or calculated from first partner
    const defaultCenter = partners.length > 0
        ? [partners[0].lat, partners[0].lng]
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

                {partners.map((partner, idx) => (
                    <Marker
                        key={idx}
                        position={[partner.lat, partner.lng]}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(partner)
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default PartnersMap;
