import { useState, useEffect } from 'react';
import { getKegs, createKeg, updateKeg, deleteKeg } from '../../services/api';
import Icon from '../Icon';
import ModalPortal from '../ui/ModalPortal';

const KegManager = () => {
    const [kegs, setKegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getKegs();
            if (Array.isArray(data)) setKegs(data);
            else setKegs([]);
        } catch (error) {
            console.error(error);
            setKegs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleCreate = () => { setEditingItem(null); setIsModalOpen(true); };
    const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este barril?")) return;
        try { await deleteKeg(id); fetchItems(); } catch (e) { alert("Error al eliminar"); }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingItem) await updateKeg(editingItem._id, formData);
            else await createKeg(formData);
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
                <h3 className="text-xl font-bold text-white">Barriles ({kegs.length})</h3>
                <button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <Icon name="Plus" size={16} /> Agregar Barril
                </button>
            </div>

            {loading ? <div className="text-center py-10 text-slate-500">Cargando...</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {kegs.map(k => (
                        <div key={k._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative group hover:border-amber-500/50 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white leading-tight">{k.size}</h4>
                                    <p className="text-xs text-amber-500 mt-0.5">{k.price}</p>
                                    <div className="text-xs text-slate-400 mt-2 space-y-1">
                                        <p><span className="text-slate-500">Rinde:</span> {k.serves}</p>
                                        <p><span className="text-slate-500">Stock:</span> {k.stock}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    {k.img && (
                                        <img
                                            src={k.img.startsWith('http') ? k.img : `${import.meta.env.BASE_URL}${k.img.replace(/^\//, '')}`}
                                            alt={k.size}
                                            className="h-16 w-auto object-contain drop-shadow-lg"
                                        />
                                    )}
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(k)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-500 transition-colors"><Icon name="Edit" size={14} /></button>
                                        <button onClick={() => handleDelete(k._id)} className="p-1.5 bg-slate-800 hover:bg-red-900 rounded text-red-500 transition-colors"><Icon name="Trash" size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && <KegFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

const KegFormModal = ({ item, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        size: '', serves: '', ideal: '', price: 'Consultar',
        stock: 0, iconSize: 48, img: '', description: '', isActive: true
    });

    useEffect(() => {
        if (item) {
            setForm({
                size: item.size || '',
                serves: item.serves || '',
                ideal: item.ideal || '',
                price: item.price || 'Consultar',
                stock: item.stock || 0,
                iconSize: item.iconSize || 48,
                img: item.img || '',
                description: item.description || '',
                isActive: item.isActive ?? true
            });
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col my-auto">
                    <div className="p-4 border-b border-white/5 flex justify-between shrink-0 items-center bg-slate-900 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-white">{item ? 'Editar' : 'Nuevo'} Barril</h3>
                        <button onClick={onClose}><Icon name="X" className="text-slate-400 hover:text-white transition-colors" size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh] custom-scrollbar">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Tamaño</label>
                            <input className="input-dark w-full mt-1 py-1.5 text-sm" placeholder="Ej: 20 Litros" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Rinde</label>
                                <input className="input-dark w-full mt-1 py-1.5 text-sm" placeholder="~40 Pintas" value={form.serves} onChange={e => setForm({ ...form, serves: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Stock</label>
                                <input type="number" className="input-dark w-full mt-1 py-1.5 text-sm" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Precio</label>
                                <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ideal Para</label>
                                <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.ideal} onChange={e => setForm({ ...form, ideal: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Imagen (URL)</label>
                            <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Descripción</label>
                            <textarea className="input-dark w-full mt-1 py-1.5 text-sm resize-none h-20" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-1.5 text-sm btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

export default KegManager;
