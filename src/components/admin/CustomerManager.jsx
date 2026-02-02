import { useState, useEffect, useMemo } from 'react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomerHistory } from '../../services/api';
import Icon from '../Icon';
import ModalPortal from '../ui/ModalPortal';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null); // For history
    const [editingCustomer, setEditingCustomer] = useState(null); // For form
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getCustomers();
            setCustomers(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent opening detail
        if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente? Se perderá su asociación con los historiales.')) return;
        try {
            await deleteCustomer(id);
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Error al eliminar: " + e.message);
        }
    };

    const handleCreate = () => { setEditingCustomer(null); setIsFormOpen(true); };

    const handleEdit = (e, customer) => {
        e.stopPropagation();
        setEditingCustomer(customer);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingCustomer) await updateCustomer(editingCustomer._id, formData);
            else await createCustomer(formData);
            setIsFormOpen(false);
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Base de Clientes ({customers.length})</h3>
                    <p className="text-sm text-slate-400">Administra tus contactos y su historial.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o teléfono..."
                            className="input-dark pl-9 pr-4 py-2 text-sm rounded-xl w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95">
                        <Icon name="Plus" size={18} /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {loading ? <div className="text-center py-20 text-slate-500 animate-pulse">Cargando clientes...</div> : (
                <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 uppercase font-medium text-xs">
                                <tr>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Teléfono</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Dirección</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCustomers.map(c => (
                                    <tr
                                        key={c._id}
                                        className="hover:bg-white/5 text-sm cursor-pointer transition-colors"
                                        onClick={() => setSelectedCustomer(c)}
                                    >
                                        <td className="px-6 py-4 font-bold text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0 border border-white/5">
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                {c.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{c.phone}</td>
                                        <td className="px-6 py-4 text-slate-400">{c.email}</td>
                                        <td className="px-6 py-4 text-slate-400">{c.address}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => handleEdit(e, c)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icon name="Edit" size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, c._id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Icon name="Trash" size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCustomers.length === 0 && (
                            <div className="text-center py-10 text-slate-500">
                                No hay clientes que coincidan.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedCustomer && (
                <CustomerDetailModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}

            {isFormOpen && (
                <CustomerFormModal
                    customer={editingCustomer}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

// Customer Form Modal
const CustomerFormModal = ({ customer, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', address: '', notes: ''
    });

    useEffect(() => {
        if (customer) {
            setForm({
                name: customer.name || '',
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || '',
                notes: customer.notes || ''
            });
        }
    }, [customer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-5 border-b border-white/5 flex justify-between shrink-0 items-center bg-slate-900 rounded-t-2xl">
                        <h3 className="text-xl font-bold text-white">{customer ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                        <button onClick={onClose}><Icon name="X" className="text-slate-400 hover:text-white transition-colors" size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Nombre Completo</label>
                            <input className="input-dark w-full px-4 py-2 text-sm rounded-lg" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Teléfono (ID)</label>
                                <input className="input-dark w-full px-4 py-2 text-sm rounded-lg" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!!customer} title={customer ? "El teléfono es el identificador único y no se puede cambiar" : ""} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                                <input type="email" className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Dirección</label>
                            <input className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Notas</label>
                            <textarea className="input-dark w-full px-4 py-2 text-sm rounded-lg resize-none h-24" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-2 text-sm btn-primary shadow-lg shadow-amber-500/20">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

// Customer Detail Modal (Keep existing)
const CustomerDetailModal = ({ customer, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await getCustomerHistory(customer._id);
                setHistory(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, [customer]);

    const stats = useMemo(() => {
        if (!history || history.length === 0) return null;
        const totalRentals = history.length;
        const totalSpent = history.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

        // Beer Preferences & Styles
        const beerCounts = {};
        const styleCounts = {};

        history.forEach(r => {
            if (r.items) {
                r.items.forEach(i => {
                    const qty = Number(i.quantity) || 0;

                    // Top Beers
                    const beerName = i.beer?.name || (typeof i.beer === 'string' ? 'Cerveza ID: ' + i.beer : 'Cerveza');
                    beerCounts[beerName] = (beerCounts[beerName] || 0) + qty;

                    // Style Stats
                    const styleName = i.beer?.style || 'Otros';
                    styleCounts[styleName] = (styleCounts[styleName] || 0) + qty;
                });
            }
        });

        const topBeers = Object.entries(beerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
        const favoriteBeer = topBeers.length > 0 ? topBeers[0][0] : 'Sin datos';

        // Process Styles
        const totalItems = Object.values(styleCounts).reduce((a, b) => a + b, 0);
        const styleStats = Object.entries(styleCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([style, count]) => ({
                style,
                count,
                percent: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
            }));
        const favoriteStyle = styleStats.length > 0 ? styleStats[0].style : 'Sin datos';

        // Frequency (Avg Days)
        let avgDaysBetween = 0;
        if (history.length > 1) {
            const dates = history.map(r => new Date(r.createdAt).getTime()).sort((a, b) => a - b);
            let totalDiff = 0;
            for (let i = 1; i < dates.length; i++) {
                totalDiff += (dates[i] - dates[i - 1]);
            }
            const avgMs = totalDiff / (dates.length - 1);
            avgDaysBetween = Math.round(avgMs / (1000 * 60 * 60 * 24));
        }

        return { totalRentals, totalSpent, topBeers, favoriteBeer, styleStats, favoriteStyle, avgDaysBetween };
    }, [history]);

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900 rounded-t-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xl">
                                {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{customer.name}</h3>
                                <p className="text-slate-400 text-xs flex items-center gap-2">
                                    <Icon name="Phone" size={12} /> {customer.phone}
                                    {customer.email && <span className="flex items-center gap-1 ml-2"><Icon name="Mail" size={12} /> {customer.email}</span>}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Icon name="X" size={24} className="text-slate-400" /></button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                <p>Cargando historial...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 italic">No hay historial de pedidos para este cliente.</div>
                        ) : (
                            <>
                                {/* Highlighted Notes */}
                                {customer.notes && (
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex gap-4 items-start">
                                        <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500 shrink-0">
                                            <Icon name="StickyNote" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-1">Notas Importantes</h4>
                                            <p className="text-slate-300 text-sm whitespace-pre-wrap">{customer.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Gastado</p>
                                        <p className="text-2xl font-bold text-emerald-400">${stats.totalSpent.toLocaleString('es-AR')}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Frecuencia</p>
                                        <p className="text-2xl font-bold text-white">
                                            {stats.avgDaysBetween ? `${stats.avgDaysBetween} días` : 'N/A'}
                                        </p>
                                        <p className="text-[10px] text-slate-500">Promedio entre compras</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Ticket Promedio</p>
                                        <p className="text-2xl font-bold text-blue-400">${Math.round(stats.totalSpent / stats.totalRentals).toLocaleString('es-AR')}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Estilo Favorito</p>
                                        <p className="text-lg font-bold text-amber-500 truncate" title={stats.favoriteStyle}>{stats.favoriteStyle}</p>
                                    </div>
                                </div>

                                {/* Style Preferences Chart & Last Activity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Icon name="PieChart" size={16} className="text-amber-500" /> Preferencias de Estilo</h4>
                                        <div className="space-y-4 bg-slate-800/30 p-5 rounded-xl border border-white/5 h-full">
                                            {stats.styleStats.length > 0 ? stats.styleStats.map((s, idx) => (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-slate-300 font-medium">{s.style}</span>
                                                        <span className="text-slate-400">{s.percent}% ({s.count} barriles)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${s.percent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )) : <div className="text-slate-500 text-sm italic">Sin datos suficientes.</div>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Icon name="Clock" size={16} className="text-blue-400" /> Último Alquiler</h4>
                                        <div className="bg-slate-800/30 p-5 rounded-xl border border-white/5 flex-1">
                                            <div className="flex justify-between mb-3">
                                                <span className="text-sm text-slate-400 font-medium">{new Date(history[0].createdAt).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase h-fit ${history[0].isPaid ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>{history[0].isPaid ? 'Pagado' : 'Pendiente'}</span>
                                            </div>
                                            <p className="text-3xl font-bold text-white mb-4">${Number(history[0].amount).toLocaleString('es-AR')}</p>

                                            <div className="space-y-2">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Ítems</p>
                                                {history[0].items && history[0].items.map((i, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                                        <span className="text-amber-500 font-bold">{i.quantity}x</span>
                                                        <span>{i.beer?.name || 'Cerveza'}</span>
                                                        <span className="text-slate-500 text-xs">({i.beer?.style || 'Estilo ?'})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full History Toggle */}
                                <div className="border-t border-white/5 pt-6 text-center">
                                    {!showHistory ? (
                                        <button
                                            onClick={() => setShowHistory(true)}
                                            className="text-amber-500 hover:text-amber-400 text-sm font-bold flex items-center justify-center gap-2 mx-auto bg-amber-500/10 hover:bg-amber-500/20 px-6 py-2 rounded-xl transition-all"
                                        >
                                            <Icon name="List" size={16} /> Ver Historial Completo ({history.length})
                                        </button>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-left">Historial Completo</h4>
                                                <button onClick={() => setShowHistory(false)} className="text-xs text-slate-500 hover:text-white">Ocultar</button>
                                            </div>
                                            <div className="overflow-x-auto max-h-60 custom-scrollbar border border-white/5 rounded-xl">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="text-xs text-slate-500 uppercase bg-black/20 sticky top-0 backdrop-blur-md">
                                                        <tr>
                                                            <th className="px-3 py-2">Fecha</th>
                                                            <th className="px-3 py-2">Ítems</th>
                                                            <th className="px-3 py-2 text-right">Total</th>
                                                            <th className="px-3 py-2 text-center">Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 bg-slate-900/50">
                                                        {history.map(r => (
                                                            <tr key={r._id} className="hover:bg-white/5">
                                                                <td className="px-3 py-2 text-slate-300">{new Date(r.createdAt).toLocaleDateString('es-AR')}</td>
                                                                <td className="px-3 py-2 text-slate-400 text-xs">
                                                                    {r.items && r.items.map((i, idx) => (
                                                                        <span key={idx} className="block">{i.quantity}x {i.beer?.name || 'Cerveza'} ({i.keg?.size || 'Barril'})</span>
                                                                    ))}
                                                                </td>
                                                                <td className="px-3 py-2 text-right font-medium text-white">${Number(r.amount).toLocaleString('es-AR')}</td>
                                                                <td className="px-3 py-2 text-center">
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${r.status === 'Devuelto' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>{r.status}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default CustomerManager;
