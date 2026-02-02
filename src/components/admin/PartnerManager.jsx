import { useState, useEffect } from 'react';
import { getAllPartnersAdmin, createPartner, updatePartner, deletePartner } from '../../services/api';
import Icon from '../Icon';
import ModalPortal from '../ui/ModalPortal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issue
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PartnerManager = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getAllPartnersAdmin();
            if (Array.isArray(data)) setPartners(data);
            else setPartners([]);
        } catch (error) {
            console.error(error);
            setPartners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleCreate = () => { setEditingItem(null); setIsModalOpen(true); };
    const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este partner?")) return;
        try { await deletePartner(id); fetchItems(); } catch (e) { alert("Error al eliminar"); }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingItem) await updatePartner(editingItem._id, formData);
            else await createPartner(formData);
            setIsModalOpen(false);
            fetchItems();
        } catch (e) {
            console.error(e);
            alert("Error al guardar");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Puntos de Venta ({partners.length})</h3>
                <button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <Icon name="Plus" size={16} /> Agregar Partner
                </button>
            </div>

            {loading ? <div className="text-center py-10 text-slate-500">Cargando...</div> : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800 text-slate-200 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3 hidden md:table-cell">Dirección</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Ciudad</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {partners.map(p => (
                                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-white/5 text-amber-500 text-xs font-bold uppercase">{p.type}</span></td>
                                    <td className="px-4 py-3 hidden md:table-cell truncate max-w-[200px]">{p.locationDetails?.address}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell">{p.locationDetails?.city}</td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-white/10 rounded text-amber-500 mr-2"><Icon name="Edit" size={16} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-red-500/10 rounded text-red-500"><Icon name="Trash" size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && <PartnerFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

const LocationPicker = ({ lat, lng, onLocationSelect }) => {
    // Default center: Medalla Factory (Freyre, Córdoba)
    const center = lat && lng ? [lat, lng] : [-31.166930, -62.100507];

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <MapContainer center={center} zoom={lat && lng ? 15 : 10} className="w-full h-full" style={{ minHeight: '100%', background: '#0f172a' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lat && lng && <Marker position={[lat, lng]} />}
            <MapEvents />
        </MapContainer>
    );
};

const PartnerFormModal = ({ item, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        name: '', type: 'Bar',
        address: '', city: '', province: '', region: '',
        lat: '', lng: '',
        phone: '', instagram: '', facebook: '', mail: '', website: '',
        features: '', varieties: '', logo: '',
        isOfficial: false, isActive: true
    });

    useEffect(() => {
        if (item) {
            setForm({
                name: item.name,
                type: item.type,
                address: item.locationDetails?.address || '',
                city: item.locationDetails?.city || '',
                province: item.locationDetails?.province || '',
                region: item.locationDetails?.region || '',
                lat: item.location?.coordinates ? item.location.coordinates[1] : '',
                lng: item.location?.coordinates ? item.location.coordinates[0] : '',
                phone: item.contact?.phone || '',
                instagram: item.contact?.instagram || '',
                facebook: item.contact?.facebook || '',
                mail: item.contact?.mail || '',
                website: item.contact?.website || '',
                features: item.features ? item.features.join(', ') : '',
                varieties: item.varieties ? item.varieties.join(', ') : '',
                logo: item.logo || '',
                isOfficial: item.isOfficial,
                isActive: item.isActive
            });
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: form.name,
            type: form.type,
            location: { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] },
            locationDetails: {
                address: form.address,
                city: form.city,
                province: form.province,
                region: form.region
            },
            contact: {
                phone: form.phone,
                instagram: form.instagram,
                facebook: form.facebook,
                mail: form.mail,
                website: form.website
            },
            features: form.features.split(',').map(s => s.trim()).filter(Boolean),
            varieties: form.varieties.split(',').map(s => s.trim()).filter(Boolean),
            logo: form.logo,
            isOfficial: form.isOfficial,
            isActive: form.isActive
        };
        onSubmit(payload);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md md:max-w-6xl shadow-2xl max-h-[90vh] flex flex-col my-auto">
                    <div className="p-4 border-b border-white/5 flex justify-between shrink-0 items-center bg-slate-900 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-white">{item ? 'Editar' : 'Nuevo'} Partner</h3>
                        <button onClick={onClose}><Icon name="X" className="text-slate-400 hover:text-white transition-colors" size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Left Column: Map (Takes up significant space on desktop) */}
                            <div className="h-64 md:h-auto md:w-1/2 lg:w-5/12 border-b md:border-b-0 md:border-r border-white/10 relative bg-slate-800">
                                <LocationPicker
                                    lat={form.lat}
                                    lng={form.lng}
                                    onLocationSelect={async (lat, lng) => {
                                        setForm(prev => ({ ...prev, lat, lng }));
                                        try {
                                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                                            const data = await res.json();
                                            if (data.address) {
                                                const addr = data.address;
                                                setForm(prev => ({
                                                    ...prev,
                                                    lat, lng,
                                                    address: addr.road ? `${addr.road} ${addr.house_number || ''}`.trim() : prev.address,
                                                    city: addr.city || addr.town || addr.village || prev.city,
                                                    province: addr.state || addr.region || prev.province,
                                                    region: addr.state_district || prev.region
                                                }));
                                            }
                                        } catch (error) {
                                            console.error("Geocoding failed", error);
                                        }
                                    }}
                                />
                                <div className="absolute top-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-white/10 p-3 rounded-lg z-[1000] shadow-xl">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Ubicación Exacta</span>
                                        <Icon name="MapPin" size={14} className="text-amber-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-tight">Haz clic en el mapa para posicionar el marcador automáticamente.</p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-500 uppercase">Lat</label>
                                            <div className="font-mono text-xs text-white bg-black/20 px-2 py-1 rounded">{form.lat ? Number(form.lat).toFixed(5) : '-'}</div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-500 uppercase">Lng</label>
                                            <div className="font-mono text-xs text-white bg-black/20 px-2 py-1 rounded">{form.lng ? Number(form.lng).toFixed(5) : '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Scrollable Form */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar md:w-1/2 lg:w-7/12 bg-slate-900/50">
                                <div className="p-6 space-y-5">
                                    {/* Main Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
                                            <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ej: Antigravity Bar" />
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo</label>
                                            <select className="input-dark w-full mt-1 py-1.5 text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                                <option value="Bar">Bar</option>
                                                <option value="Punto de Venta">Punto de Venta</option>
                                                <option value="Fábrica">Fábrica</option>
                                                <option value="Distribuidor">Distribuidor</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Address Details */}
                                    <div className="pt-2 border-t border-white/5">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Dirección Física</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="sm:col-span-2">
                                                <input className="input-dark w-full py-1.5 text-sm" placeholder="Calle y Altura (Ej: Av. San Martín 1234)" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                            </div>
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Ciudad (Ej: Mendoza)" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Provincia (Ej: Mendoza)" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} />
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Región/Zona (Ej: Cuyo)" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* Contact & Socials */}
                                    <div className="pt-2 border-t border-white/5">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Contacto & Redes</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Instagram (URL Completa)" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Website / Facebook" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                            <input className="input-dark w-full py-1.5 text-sm" placeholder="Email" value={form.mail} onChange={e => setForm({ ...form, mail: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* Extra Details */}
                                    <div className="pt-2 border-t border-white/5">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Detalles Adicionales</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Logo URL</label>
                                                <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Variedades (Sep. por comas)</label>
                                                    <input className="input-dark w-full mt-1 py-1.5 text-sm" placeholder="Golden, IPA, Stout..." value={form.varieties} onChange={e => setForm({ ...form, varieties: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Características (Sep. por comas)</label>
                                                    <input className="input-dark w-full mt-1 py-1.5 text-sm" placeholder="Terraza, Comida, DJ..." value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Toggles */}
                                    <div className="flex gap-6 pt-2">
                                        <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer select-none hover:text-white transition-colors">
                                            <input type="checkbox" checked={form.isOfficial} onChange={e => setForm({ ...form, isOfficial: e.target.checked })} className="accent-amber-500 w-4 h-4" />
                                            <span className="font-medium">Es Oficial</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer select-none hover:text-white transition-colors">
                                            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-amber-500 w-4 h-4" />
                                            <span className="font-medium">Activo</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 bg-slate-900 shrink-0 flex justify-end gap-3 rounded-b-2xl z-10 relative">
                            <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-1.5 text-sm btn-primary">Guardar Partner</button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

export default PartnerManager;
