import { useState, useEffect } from 'react';
import { getAllEventsAdmin, createEvent, updateEvent, deleteEvent } from '../../services/api';
import Icon from '../Icon';
import ModalPortal from '../ui/ModalPortal';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await getAllEventsAdmin();
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                console.error("API did not return an array:", data);
                setEvents([]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreate = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este evento?")) return;
        try {
            await deleteEvent(id);
            fetchEvents();
        } catch (error) {
            alert("Error al eliminar evento");
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingEvent) {
                await updateEvent(editingEvent._id, formData);
            } else {
                await createEvent(formData);
            }
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert("Error al guardar evento");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Eventos ({events.length})</h3>
                <button
                    onClick={handleCreate}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
                >
                    <Icon name="Plus" size={16} /> Crear Evento
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Cargando eventos...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-3 rounded-tl-lg">Fecha</th>
                                <th className="px-6 py-3">Título</th>
                                <th className="px-6 py-3">Lugar</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 rounded-tr-lg text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-slate-900/50">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        {new Date(event.date).toLocaleDateString('es-AR')}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                                    <td className="px-6 py-4">{event.location?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${event.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                                            {event.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(event)} className="p-2 hover:bg-white/10 rounded text-slate-300 hover:text-white">
                                                <Icon name="Edit" size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="p-2 hover:bg-red-500/10 rounded text-slate-300 hover:text-red-400">
                                                <Icon name="Trash" size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <EventFormModal
                    event={editingEvent}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

const EventFormModal = ({ event, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        locationName: '',
        isActive: true
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title,
                date: new Date(event.date).toISOString().split('T')[0], // YYYY-MM-DD
                description: event.description,
                locationName: event.location?.name || '',
                isActive: event.isActive
            });
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Transform back to Schema structure
        const payload = {
            title: formData.title,
            date: new Date(formData.date),
            description: formData.description,
            location: {
                name: formData.locationName
            },
            isActive: formData.isActive
        };
        onSubmit(payload);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md md:max-w-3xl shadow-2xl max-h-[90vh] flex flex-col my-auto">
                    <div className="p-5 border-b border-white/5 flex justify-between shrink-0 items-center bg-slate-900 rounded-t-2xl">
                        <h3 className="text-xl font-bold text-white">{event ? 'Editar Evento' : 'Nuevo Evento'}</h3>
                        <button onClick={onClose}><Icon name="X" className="text-slate-400 hover:text-white" size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Título</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-dark w-full"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        className="input-dark w-full"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estado</label>
                                    <select
                                        className="input-dark w-full"
                                        value={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Lugar</label>
                                    <input
                                        type="text"
                                        className="input-dark w-full"
                                        value={formData.locationName}
                                        onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descripción</label>
                                    <textarea
                                        className="input-dark w-full h-32 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-white/5 bg-slate-900 shrink-0 flex justify-end gap-3 rounded-b-2xl">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-medium">Cancelar</button>
                            <button type="submit" className="px-6 py-2 btn-primary">
                                {event ? 'Guardar Cambios' : 'Crear Evento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

export default EventManager;
