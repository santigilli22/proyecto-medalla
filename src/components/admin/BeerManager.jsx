import { useState, useEffect } from 'react';
import { getBeers, createBeer, updateBeer, deleteBeer } from '../../services/api';
import Icon from '../Icon';
import ModalPortal from '../ui/ModalPortal';

const BeerManager = () => {
    const [beers, setBeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getBeers(); // Uses public getBeers which lists all
            if (Array.isArray(data)) setBeers(data);
            else setBeers([]);
        } catch (error) {
            console.error(error);
            setBeers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleCreate = () => { setEditingItem(null); setIsModalOpen(true); };
    const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta cerveza?")) return;
        try { await deleteBeer(id); fetchItems(); } catch (e) { alert("Error al eliminar"); }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingItem) await updateBeer(editingItem.id, formData); // Using numeric 'id' legacy field
            else await createBeer(formData);
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
                <h3 className="text-xl font-bold text-white">Catálogo ({beers.length})</h3>
                <button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <Icon name="Plus" size={16} /> Agregar Cerveza
                </button>
            </div>

            {loading ? <div className="text-center py-10 text-slate-500">Cargando...</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {beers.map(b => (
                        <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative group hover:border-amber-500/50 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white leading-tight truncate">{b.name}</h4>
                                    <p className="text-xs text-amber-500 mt-0.5 truncate">{b.style}</p>
                                    <div className="text-xs text-slate-400 grid grid-cols-3 gap-1 mt-2">
                                        <div className="flex flex-col"><span className="text-[10px] text-slate-500">ABV</span><span>{b.specs?.abv}%</span></div>
                                        <div className="flex flex-col"><span className="text-[10px] text-slate-500">IBU</span><span>{b.specs?.ibu}</span></div>
                                        <div className="flex flex-col"><span className="text-[10px] text-slate-500">SRM</span><span>{b.specs?.srm}</span></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    {(b.images?.main || b.titleImg) && (
                                        <img
                                            src={(b.images?.main || b.titleImg).startsWith('http') ? (b.images?.main || b.titleImg) : `${import.meta.env.BASE_URL}${(b.images?.main || b.titleImg).replace(/^\//, '')}`}
                                            alt={b.name}
                                            className="h-16 w-auto object-contain drop-shadow-lg"
                                        />
                                    )}
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(b)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-500 transition-colors"><Icon name="Edit" size={14} /></button>
                                        <button onClick={() => handleDelete(b.id)} className="p-1.5 bg-slate-800 hover:bg-red-900 rounded text-red-500 transition-colors"><Icon name="Trash" size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && <BeerFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

const BeerFormModal = ({ item, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        id: Date.now(),
        name: '', titleImg: '', persona: '', category: '', style: 'Golden Ale',
        abv: '', ibu: '', srm: '', color: 'bg-amber-500',
        mainImg: '', detailImg: '', tags: ''
    });

    const BEER_STYLES = [
        "Golden Ale", "IPA", "APA", "Honey", "Scottish", "Stout",
        "Porter", "Lager", "Wheat", "Red Ale", "Sour", "Barley Wine"
    ];

    // Main Tailwind colors (500 weight)
    const BEER_COLORS = [
        { class: "bg-slate-500", label: "Slate" }, { class: "bg-gray-500", label: "Gray" }, { class: "bg-zinc-500", label: "Zinc" },
        { class: "bg-neutral-500", label: "Neutral" }, { class: "bg-stone-500", label: "Stone" }, { class: "bg-red-500", label: "Red" },
        { class: "bg-orange-500", label: "Orange" }, { class: "bg-amber-500", label: "Amber" }, { class: "bg-yellow-500", label: "Yellow" },
        { class: "bg-lime-500", label: "Lime" }, { class: "bg-green-500", label: "Green" }, { class: "bg-emerald-500", label: "Emerald" },
        { class: "bg-teal-500", label: "Teal" }, { class: "bg-cyan-500", label: "Cyan" }, { class: "bg-sky-500", label: "Sky" },
        { class: "bg-blue-500", label: "Blue" }, { class: "bg-indigo-500", label: "Indigo" }, { class: "bg-violet-500", label: "Violet" },
        { class: "bg-purple-500", label: "Purple" }, { class: "bg-fuchsia-500", label: "Fuchsia" }, { class: "bg-pink-500", label: "Pink" },
        { class: "bg-rose-500", label: "Rose" }, { class: "bg-black", label: "Black" }, { class: "bg-white", label: "White" }
    ];

    useEffect(() => {
        if (item) {
            setForm({
                id: item.id,
                name: item.name,
                titleImg: item.titleImg || '',
                persona: item.persona || '',
                category: item.category || '',
                style: item.style || 'Golden Ale',
                abv: item.specs?.abv || '',
                ibu: item.specs?.ibu || '',
                srm: item.specs?.srm || '',
                color: item.color || 'bg-amber-500',
                mainImg: item.images?.main || '',
                detailImg: item.images?.detail || '',
                tags: item.tags ? item.tags.join(', ') : ''
            });
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            id: form.id,
            name: form.name,
            titleImg: form.titleImg,
            persona: form.persona,
            category: form.category,
            style: form.style,
            specs: { abv: form.abv, ibu: Number(form.ibu), srm: Number(form.srm) },
            color: form.color,
            images: { main: form.mainImg, detail: form.detailImg },
            tags: form.tags.split(',').map(s => s.trim()).filter(Boolean)
        };
        onSubmit(payload);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md md:max-w-5xl shadow-2xl max-h-[90vh] flex flex-col my-auto">
                    <div className="p-4 border-b border-white/5 flex justify-between shrink-0 items-center bg-slate-900 rounded-t-2xl">
                        <h3 className="text-lg font-bold text-white">{item ? 'Editar' : 'Nueva'} Cerveza</h3>
                        <button onClick={onClose}><Icon name="X" className="text-slate-400 hover:text-white transition-colors" size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                            {/* Row 1: Basic Info & Specs combined */}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
                                    <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Estilo</label>
                                    <select className="input-dark w-full mt-1 py-1.5 text-sm" value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}>
                                        {BEER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
                                    <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Opcional" />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase" title="Alcohol">ABV%</label>
                                        <input className="input-dark w-full mt-1 py-1.5 text-sm text-center" placeholder="5.5" value={form.abv} onChange={e => setForm({ ...form, abv: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase" title="Amargor">IBU</label>
                                        <input className="input-dark w-full mt-1 py-1.5 text-sm text-center" placeholder="25" type="number" value={form.ibu} onChange={e => setForm({ ...form, ibu: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase" title="Color">SRM</label>
                                        <input className="input-dark w-full mt-1 py-1.5 text-sm text-center" placeholder="6" type="number" value={form.srm} onChange={e => setForm({ ...form, srm: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Visuals */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Color de Identidad</label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {BEER_COLORS.map((c) => (
                                            <button
                                                key={c.class}
                                                type="button"
                                                onClick={() => setForm({ ...form, color: c.class })}
                                                className={`w-6 h-6 rounded-full border border-white/10 transition-all ${c.class} ${form.color === c.class ? 'ring-2 ring-white scale-110 z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                                                title={c.label}
                                            />
                                        ))}
                                    </div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tags</label>
                                    <input className="input-dark w-full mt-1 py-1.5 text-sm" placeholder="Ej: Refrescante, Cítrica" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Persona / Descripción</label>
                                    <textarea
                                        className="input-dark w-full flex-1 mt-1 resize-none py-2 text-sm"
                                        placeholder="Breve descripción con personalidad..."
                                        value={form.persona}
                                        onChange={e => setForm({ ...form, persona: e.target.value })}
                                        style={{ minHeight: '120px' }}
                                    />
                                </div>
                            </div>

                            {/* Row 3: Images */}
                            <div className="pt-2 border-t border-white/5">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Imágenes (URLs)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Icono (Title)</label>
                                        <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.titleImg} onChange={e => setForm({ ...form, titleImg: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Lata (Main)</label>
                                        <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.mainImg} onChange={e => setForm({ ...form, mainImg: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Pour (Detail)</label>
                                        <input className="input-dark w-full mt-1 py-1.5 text-sm" value={form.detailImg} onChange={e => setForm({ ...form, detailImg: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 bg-slate-900 shrink-0 flex justify-end gap-3 rounded-b-2xl">
                            <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-1.5 text-sm btn-primary">Guardar Cerveza</button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

export default BeerManager;
