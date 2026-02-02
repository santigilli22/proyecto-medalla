import { useState, useEffect, useMemo, useRef } from 'react';
import { getRentals, createRental, updateRental, deleteRental, getKegs, getBeers, getCustomers } from '../../services/api';
import Icon from '../Icon';
import ModalPortal from '../ui/ModalPortal';


const RentalManager = () => {
    const [rentals, setRentals] = useState([]);
    const [kegs, setKegs] = useState([]);
    const [beers, setBeers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // UI State
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
    const [sortConfig, setSortConfig] = useState({ key: 'pickupDate', direction: 'desc' });

    // History Filters
    const [historySearch, setHistorySearch] = useState('');
    const [historyDate, setHistoryDate] = useState({ start: '', end: '' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rData, kData, bData, cData] = await Promise.all([
                getRentals(),
                getKegs(),
                getBeers(),
                getCustomers()
            ]);
            setRentals(rData || []);
            setKegs(kData || []);
            setBeers(bData || []);
            setCustomers(cData || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = () => { setEditingItem(null); setIsFormOpen(true); };
    const handleEdit = (item) => { setEditingItem(item); setIsFormOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este registro de alquiler? Esta acción no se puede deshacer.')) return;
        try {
            await deleteRental(id);
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Error al eliminar: " + e.message);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingItem) await updateRental(editingItem._id, formData);
            else await createRental(formData);
            setIsFormOpen(false);
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('es-AR', { timeZone: 'UTC' });
    const getStatusColor = (status) => {
        if (status === 'Devuelto') return 'bg-emerald-500/20 text-emerald-500';
        if (status === 'Retirado') return 'bg-amber-500/20 text-amber-500';
        if (status === 'Reservado') return 'bg-blue-500/20 text-blue-400';
        return 'bg-slate-700 text-slate-300';
    };
    const getPaymentColor = (isPaid) => isPaid ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10';
    const getBeerName = (id) => beers.find(b => b._id === id)?.name || 'Cerveza';

    // --- Filtering & Sorting Logic ---

    const isCompleted = (r) => r.status === 'Devuelto' && r.isPaid;

    const filteredRentals = useMemo(() => {
        let filtered = [...rentals];

        // Tab Filter
        if (activeTab === 'active') {
            filtered = filtered.filter(r => !isCompleted(r));
        } else {
            // History Tab Filters
            if (historySearch) {
                const q = historySearch.toLowerCase();
                filtered = filtered.filter(r =>
                    r.customerName.toLowerCase().includes(q) ||
                    (r.contact && r.contact.includes(q))
                );
            }
            if (historyDate.start) {
                filtered = filtered.filter(r => new Date(r.pickupDate) >= new Date(historyDate.start));
            }
            if (historyDate.end) {
                const end = new Date(historyDate.end);
                end.setHours(23, 59, 59, 999);
                filtered = filtered.filter(r => new Date(r.pickupDate) <= end);
            }
        }

        // Sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                if (sortConfig.key === 'amount') { valA = Number(valA); valB = Number(valB); }
                else { valA = valA ? valA.toString().toLowerCase() : ''; valB = valB ? valB.toString().toLowerCase() : ''; }
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [rentals, activeTab, sortConfig, historySearch, historyDate]);

    // Pagination Calculation
    const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
    const paginatedRentals = useMemo(() => {
        if (activeTab === 'active') return filteredRentals; // No pagination for active? Or maybe only history. User said "historial completo table" max 10.
        // Let's paginate history only as requested.
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRentals.slice(start, start + itemsPerPage);
    }, [filteredRentals, currentPage, itemsPerPage, activeTab]);

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [historySearch, historyDate, activeTab]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handlePrintHistory = () => {
        window.print();
    };

    // Components
    const SortButton = ({ label, sortKey }) => (
        <button onClick={() => requestSort(sortKey)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${sortConfig.key === sortKey ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {label} {sortConfig.key === sortKey && <Icon name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />}
        </button>
    );

    return (
        <div className="print:p-0">
            <style>{`
                @media print {
                    @page { margin: 0; size: A4 portrait; }
                    
                    /* Hide non-print elements */
                    aside, header, button, .no-print, input, select, .input-dark, .icon { display: none !important; }
                    
                    /* GLOBAL RESET */
                    * {
                        box-sizing: border-box !important; /* Critical for padding */
                        box-shadow: none !important;
                        text-shadow: none !important;
                        border-radius: 0 !important;
                        background-color: transparent !important;
                    }

                    html, body, #root { 
                        width: 100% !important;
                        margin: 0 !important; 
                        padding: 0 !important;
                        background: white !important; 
                        color: black !important; 
                    }

                    /* 
                       TEMPLATE STRUCTURE 
                       - Header: Fixed Top
                       - Footer: Fixed Bottom
                       - Body: Padded to avoid overlap
                    */
                    
                    .print-header { 
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        width: 100% !important;
                        height: auto;
                        padding: 10mm !important; 
                        background: white !important;
                        z-index: 1000;
                        border-bottom: 2px solid #000; 
                        display: flex !important;
                        justify-content: space-between;
                        align-items: flex-end;
                    }

                    .print-footer { 
                        position: fixed !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        width: 100% !important;
                        height: auto;
                        padding: 10mm !important; 
                        background: white !important;
                        z-index: 1000;
                        border-top: 2px solid #000; 
                        display: flex !important;
                        justify-content: space-between;
                    }

                    /* Main Table Container */
                    .print-container-wrapper, .bg-slate-800\\/40, .rounded-2xl {
                        display: block !important;
                        width: 100% !important;
                        margin: 0 !important;
                        border: none !important;
                        
                        /* Layout matching Header/Footer */
                        
                        
                        /* Vertical Clearance */
                        padding-top: 1.5mm !important; /* Adjusted for header height */
                        padding-bottom: 20mm !important; /* Adjusted for footer height */
                    }
                    
                    table { 
                        width: 100% !important; 
                        border-collapse: collapse !important; 
                        font-family: sans-serif; 
                        font-size: 10px;
                    }

                    thead { display: table-header-group; }
                    th { border-bottom: 2px solid #000 !important; padding: 4px 0 !important; text-align: center; font-weight: 800; color: black !important; font-size: 9px; text-transform: uppercase; }
                    
                    td { border-bottom: 1px solid #ddd !important; padding: 4px 0 !important; vertical-align: top; color: black !important; line-height: 1.25; }
                    tr { break-inside: avoid; }
                    
                    .status-badge { border: 1px solid #000; padding: 1px 4px; border-radius: 4px; font-size: 8px; font-weight: bold; text-transform: uppercase; color: #000000; }
                    
                    /* Reset Sidebar Offsets */
                    [class*="ml-"], [class*="pl-"], [class*="left-"] { margin-left: 0 !important; padding-left: 0 !important; left: 0 !important; }
                    
                    /* Text Visibility */
                    .text-white, .text-slate-300, .text-slate-400, .text-slate-500, .text-gray-600 { color: black !important; }
                }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 no-print">
                <div>
                    <h3 className="text-xl font-bold text-white">Gestión de Alquileres</h3>
                    <div className="flex gap-4 mt-2 border-b border-white/10">
                        <button onClick={() => setActiveTab('active')} className={`pb-2 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'active' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-white'}`}>
                            En Curso ({rentals.filter(r => !isCompleted(r)).length})
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`pb-2 px-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'history' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-500 hover:text-white'}`}>
                            Historial Completo
                        </button>
                    </div>
                </div>
                <button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95">
                    <Icon name="Plus" size={18} /> Nuevo Registro
                </button>
            </div>

            {/* History Filters (Only shown in History tab) */}
            {activeTab === 'history' && (
                <div className="flex flex-wrap items-center gap-3 mb-4 bg-slate-800/40 p-3 rounded-xl border border-white/5 no-print">
                    <Icon name="Filter" size={16} className="text-slate-500" />
                    <input type="text" placeholder="Buscar cliente..." className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500" value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                    <input type="date" className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 text-slate-400" value={historyDate.start} onChange={e => setHistoryDate(prev => ({ ...prev, start: e.target.value }))} />
                    <span className="text-slate-500">-</span>
                    <input type="date" className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 text-slate-400" value={historyDate.end} onChange={e => setHistoryDate(prev => ({ ...prev, end: e.target.value }))} />
                    <div className="flex-1"></div>
                    <button onClick={handlePrintHistory} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <Icon name="Printer" size={16} /> Imprimir Lista
                    </button>
                </div>
            )}

            {/* Content Area */}
            {loading ? <div className="text-center py-20 text-slate-500 animate-pulse">Cargando datos...</div> : (
                <>
                    {/* Active Tab: Card View */}
                    {activeTab === 'active' && (
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex justify-end gap-2 mb-2 no-print">
                                <span className="text-xs text-slate-500 uppercase font-bold self-center mr-1">Ordenar:</span>
                                <SortButton label="Fecha" sortKey="pickupDate" />
                                <SortButton label="Cliente" sortKey="customerName" />
                            </div>

                            {filteredRentals.map(r => {
                                const isPickedUp = r.status === 'Retirado' || r.status === 'Devuelto';
                                const isReturned = r.status === 'Devuelto';
                                return (
                                    <div key={r._id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-5 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between group hover:bg-slate-800/60 transition-all duration-300">
                                        <div className="flex-1 w-full xl:w-auto">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">{r.customerName.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight">{r.customerName}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusColor(r.status)}`}>{r.status}</span>
                                                        {r.contact && <span className="text-xs text-slate-500 flex items-center gap-1"><Icon name="Phone" size={10} /> {r.contact}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pl-12 text-sm text-slate-400 flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                                <span className="flex items-center gap-1.5 text-slate-500"><Icon name="Clock" size={14} /> <span className="text-slate-400">Reserva: {formatDate(r.createdAt)}</span></span>
                                                {isPickedUp && r.pickupDate && <span className="flex items-center gap-1.5 text-amber-400"><Icon name="CheckCircle" size={14} /> Retiro: <span className="text-white">{formatDate(r.pickupDate)}</span></span>}
                                                {isReturned && r.returnDate && <span className="flex items-center gap-1.5 text-emerald-400"><Icon name="CheckCircle" size={14} /> Devuelto: <span className="text-white">{formatDate(r.returnDate)}</span></span>}
                                            </div>
                                        </div>
                                        <div className="w-full xl:w-1/3 bg-black/20 rounded-xl p-3 border border-white/5">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Detalle</span>
                                            {r.items.map((i, idx) => (
                                                <div key={idx} className="text-sm border-b border-white/5 last:border-0 pb-1 last:pb-0 mb-1 last:mb-0">
                                                    <span className="text-slate-300 font-medium"><span className="text-amber-500 font-bold">{i.quantity}x</span> {i.keg?.size || 'Barril'} • {getBeerName(i.beer)}</span>
                                                    {i.barrelIds && i.barrelIds.length > 0 && <div className="text-xs text-slate-500 font-mono mt-0.5 ml-6">IDs: {i.barrelIds.join(', ')}</div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 border-white/5 pt-4 xl:pt-0">
                                            <div className="text-right">
                                                <p className="font-bold text-white text-xl tracking-tight">${r.amount?.toLocaleString('es-AR')}</p>
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${getPaymentColor(r.isPaid)}`}>{r.isPaid ? 'Pagado' : 'Pendiente'}</span>
                                            </div>
                                            <div className="flex gap-2 no-print">
                                                <button onClick={() => handleEdit(r)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors border border-white/5"><Icon name="Edit" size={18} /></button>
                                                <button onClick={() => handleDelete(r._id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20"><Icon name="Trash" size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredRentals.length === 0 && <div className="text-center py-20 text-slate-500">No hay alquileres en curso.</div>}
                        </div>
                    )}

                    {/* History Tab: Table View (Professional Print Layout) */}
                    {activeTab === 'history' && (
                        <div className="bg-slate-800/40 border border-white/5 rounded-2xl print:bg-transparent print:border-none print:shadow-none print:w-full">

                            {/* PROFESSIONAL PRINT HEADER (Hidden on screen) */}
                            <div className="print-header hidden flex-row justify-between items-end border-b-2 border-black pb-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold uppercase tracking-wider text-black">Medalla</h1>
                                    <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mt-1">Reporte de Alquileres</p>
                                </div>
                                <div className="text-right text-xs text-gray-500">
                                    <p>Generado: {new Date().toLocaleDateString('es-AR')} {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>

                                    {/* Conditional Print Filters */}
                                    {(historySearch || historyDate.start || historyDate.end) && (
                                        <div className="mt-1 pt-1 border-t border-gray-300">
                                            {historySearch && <p>Búsqueda: <span className="font-bold text-black">"{historySearch}"</span></p>}
                                            {(historyDate.start || historyDate.end) && (
                                                <p>
                                                    {historyDate.start && <span>Desde: <span className="font-bold text-black">{new Date(historyDate.start).toLocaleDateString('es-AR')}</span></span>}
                                                    {historyDate.start && historyDate.end && <span className="mx-1">-</span>}
                                                    {historyDate.end && <span>Hasta: <span className="font-bold text-black">{new Date(historyDate.end).toLocaleDateString('es-AR')}</span></span>}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900/50 text-slate-400 uppercase font-medium text-xs">
                                        <tr>
                                            <th className="px-4 py-3 print:py-2 align-bottom">Reserva</th>
                                            <th className="px-4 py-3 print:py-2 align-bottom">Cliente</th>
                                            <th className="px-4 py-3 print:py-2 align-bottom">Ítems</th>
                                            <th className="px-4 py-3 print:py-2 align-bottom text-center">Retiro</th>
                                            <th className="px-4 py-3 print:py-2 align-bottom text-center">Devolución</th>
                                            <th className="px-4 py-3 print:py-2 align-bottom text-right">Total</th>
                                            <th className="px-4 py-3 print:py-2 align-bottom text-center">Pagado</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/5 print:divide-gray-300">
                                        {paginatedRentals.map(r => (
                                            <tr key={r._id} className="hover:bg-white/5 print:hover:bg-transparent text-sm">
                                                {/* Reserva */}
                                                <td className="px-4 py-3 print:py-2 align-top text-white print:text-black">
                                                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-AR') : '-'}
                                                </td>

                                                {/* Cliente */}
                                                <td className="px-4 py-3 print:py-2 align-top text-white print:text-black font-medium">
                                                    {r.customerName}
                                                </td>

                                                {/* Items */}
                                                <td className="px-4 py-3 print:px-0 print:py-2 align-top">
                                                    {r.items.map((i, idx) => (
                                                        <div key={idx} className="text-xs text-slate-300 print:text-black mb-1">
                                                            <span className="font-bold text-white print:text-black">{i.quantity}x</span> {i.keg?.size} {getBeerName(i.beer)}
                                                            {i.barrelIds && i.barrelIds.length > 0 && (
                                                                <span className="ml-2 font-mono text-[10px] text-slate-500 print:text-gray-600 print:bg-gray-100 px-1 rounded">
                                                                    #: {i.barrelIds.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </td>

                                                {/* Retiro */}
                                                <td className="px-4 py-3 print:py-2 align-top text-center text-white print:text-black">
                                                    {r.pickupDate ? new Date(r.pickupDate).toLocaleDateString('es-AR') : '-'}
                                                </td>

                                                {/* Devolución */}
                                                <td className="px-4 py-3 print:py-2 align-top text-center text-white print:text-black">
                                                    {r.returnDate ? new Date(r.returnDate).toLocaleDateString('es-AR') : '-'}
                                                </td>

                                                {/* Total */}
                                                <td className="px-4 py-3 print:py-2 align-top text-right font-bold text-white print:text-black">
                                                    ${r.amount?.toLocaleString('es-AR')}
                                                </td>

                                                {/* Pagado */}
                                                <td className="px-4 py-3 print:py-2 align-top text-center">
                                                    <div className={`flex justify-center items-center ${r.isPaid ? 'text-emerald-400 print:text-black' : 'text-red-400 print:text-black'}`}>
                                                        <Icon name={r.isPaid ? "Check" : "X"} size={16} className="bg-transparent" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls (Screen Only) */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center px-4 py-3 border-t border-white/5 no-print">
                                    <div className="text-xs text-slate-500">
                                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRentals.length)} de {filteredRentals.length}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent text-slate-400 disabled:cursor-not-allowed"
                                        >
                                            <Icon name="ChevronLeft" size={16} />
                                        </button>
                                        <span className="text-sm text-slate-400 font-medium px-2">{currentPage} / {totalPages}</span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent text-slate-400 disabled:cursor-not-allowed"
                                        >
                                            <Icon name="ChevronRight" size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PROFESSIONAL PRINT FOOTER (Hidden on screen) */}
                            <div className="print-footer hidden flex-row justify-between items-start border-t-2 border-black pt-4 mt-6">
                                <div>
                                    <p className="font-bold uppercase">Resumen</p>
                                    <p>Total Registros: {filteredRentals.length}</p>
                                    <p>Pendientes de Pago: {filteredRentals.filter(r => !r.isPaid).length}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold uppercase text-lg">Total General</p>
                                    <p className="text-2xl font-bold">${filteredRentals.reduce((sum, r) => sum + (Number(r.amount) || 0), 0).toLocaleString('es-AR')}</p>
                                </div>
                            </div>

                            {paginatedRentals.length === 0 && <div className="text-center py-10 text-slate-500 no-print">No se encontraron registros.</div>}
                        </div>
                    )}

                    {/* Customers Tab Removed */}
                </>
            )}

            {isFormOpen && !editingItem?.isStats && <RentalFormModal item={editingItem} kegs={kegs} beers={beers} customers={customers} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

function RentalFormModal({ item, kegs, beers, customers, onClose, onSubmit }) {
    // Helper to format date for input (YYYY-MM-DD)
    const dateToInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
    const today = new Date().toISOString().split('T')[0]; // Kept to avoid ReferenceError if used elsewhere

    // Local state for searching customers
    const [searchCustomer, setSearchCustomer] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Initial item state for adding new items
    const initialItemState = {
        kegId: '', beerId: '', quantity: 1, barrelIdsString: '', unitPrice: ''
    };

    const [form, setForm] = useState({
        customerName: '', contact: '',
        pickupDate: '', returnDate: '', // Empty by default
        items: [], // Array of items
        amount: '',
        isPaid: false, paymentMethod: 'Efectivo', notes: '', status: 'Reservado'
    });

    const [currentItem, setCurrentItem] = useState(initialItemState);

    useEffect(() => {
        if (item) {
            setForm({
                customerName: item.customerName,
                contact: item.contact || '',
                pickupDate: dateToInput(item.pickupDate),
                returnDate: dateToInput(item.returnDate),
                items: item.items.map(i => ({
                    kegId: i.keg?._id || i.keg,
                    beerId: i.beer?._id || i.beer,
                    quantity: i.quantity,
                    barrelIdsString: i.barrelIds ? i.barrelIds.join(', ') : '',
                    // We don't have unitPrice persistence in schema, so we estimate or leave blank
                    unitPrice: ''
                })),
                amount: item.amount || '',
                isPaid: item.isPaid,
                paymentMethod: item.paymentMethod || 'Efectivo',
                notes: item.notes || '',
                status: item.status
            });
            setSearchCustomer(item.customerName);
        }
    }, [item]);

    // Handle Search Input
    const handleCustomerSearchChange = (e) => {
        const val = e.target.value;
        setSearchCustomer(val);
        setForm(prev => ({ ...prev, customerName: val }));
        setShowSuggestions(true);
    };

    const selectCustomer = (customer) => {
        setSearchCustomer(customer.name);
        setForm(prev => ({
            ...prev,
            customerName: customer.name,
            contact: customer.phone
        }));
        setShowSuggestions(false);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        c.phone.includes(searchCustomer)
    );

    // --- Item Management Logic ---

    const handleKegChange = (kegId) => {
        const keg = kegs.find(k => k._id === kegId);
        let newPrice = currentItem.unitPrice;
        if (keg) {
            const numericPrice = parseFloat(keg.price);
            if (!isNaN(numericPrice)) newPrice = numericPrice;
        }
        setCurrentItem(prev => ({ ...prev, kegId, unitPrice: newPrice }));
    };

    const addItem = () => {
        if (!currentItem.kegId || !currentItem.quantity) {
            alert("Selecciona un tamaño de barril y cantidad.");
            return;
        }

        const newItem = { ...currentItem };
        const qty = Number(newItem.quantity) || 0;
        const price = Number(newItem.unitPrice) || 0;
        const addedAmount = qty * price;
        const newBarrelIds = newItem.barrelIdsString.split(',').map(s => s.trim()).filter(Boolean);

        // Validation: IDs must not be empty and must match quantity
        if (newBarrelIds.length === 0) {
            alert("El campo 'N° de barriles' no puede estar vacío.");
            return;
        }
        if (newBarrelIds.length !== qty) {
            alert(`La cantidad de IDs ingresados (${newBarrelIds.length}) no coincide con la cantidad de barriles seleccionada (${qty}).`);
            return;
        }

        setForm(prev => {
            const existingItemIndex = prev.items.findIndex(
                i => i.kegId === newItem.kegId && i.beerId === newItem.beerId
            );

            let newItems;
            if (existingItemIndex >= 0) {
                // Merge with existing item
                const existing = prev.items[existingItemIndex];
                const updatedItem = {
                    ...existing,
                    quantity: Number(existing.quantity) + qty,
                    // Merge barrel IDs string
                    barrelIdsString: [
                        ...existing.barrelIdsString.split(',').map(s => s.trim()).filter(Boolean),
                        ...newBarrelIds
                    ].join(', ')
                };
                newItems = [...prev.items];
                newItems[existingItemIndex] = updatedItem;
            } else {
                newItems = [...prev.items, newItem];
            }

            return {
                ...prev,
                items: newItems,
                amount: (Number(prev.amount) || 0) + addedAmount
            };
        });

        setCurrentItem(initialItemState);
    };

    const removeItem = (index) => {
        const itemToRemove = form.items[index];
        const qty = Number(itemToRemove.quantity) || 0;
        const price = Number(itemToRemove.unitPrice) || 0;
        const deduction = qty * price;

        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
            amount: Math.max(0, (Number(prev.amount) || 0) - deduction)
        }));
    };

    // --- Helpers for Display ---
    const getKegSize = (id) => kegs.find(k => k._id === id)?.size || 'Barril';
    const getBeerName = (id) => beers.find(b => b._id === id)?.name || 'Sin Cerveza';

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.items.length === 0) {
            alert("Debes agregar al menos un ítem al pedido.");
            return;
        }

        // Convert empty date strings to null for submission
        const submissionData = {
            ...form,
            pickupDate: form.pickupDate || null,
            returnDate: form.returnDate || null,
            items: form.items.map(i => ({
                keg: i.kegId,
                beer: i.beerId,
                quantity: Number(i.quantity),
                barrelIds: i.barrelIdsString.split(',').map(s => s.trim()).filter(Boolean)
            }))
        };
        onSubmit(submissionData);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col my-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-5 border-b border-white/5 flex justify-between shrink-0 items-center bg-slate-900 rounded-t-2xl">
                        <div>
                            <h3 className="text-xl font-bold text-white">{item ? 'Editar Registro' : 'Nuevo Alquiler'}</h3>
                            <p className="text-slate-400 text-xs mt-0.5">Complete todos los datos requeridos.</p>
                        </div>
                        <button onClick={onClose}><Icon name="X" className="text-slate-400 hover:text-white transition-colors" size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar" onClick={() => setShowSuggestions(false)}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Left Column: Client & Items */}
                            <div className="space-y-6">
                                {/* Section: Cliente */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                        <Icon name="Users" size={14} /> Cliente
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-1 relative">
                                            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Nombre / Buscar</label>
                                            <div className="relative">
                                                <input
                                                    className="input-dark w-full pl-11 pr-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                                    required
                                                    value={searchCustomer}
                                                    onChange={handleCustomerSearchChange}
                                                    onFocus={() => setShowSuggestions(true)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    placeholder="Buscar cliente..."
                                                    autoComplete="off"
                                                />
                                                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                            </div>

                                            {/* Custom Suggestions Dropdown */}
                                            {showSuggestions && searchCustomer && (
                                                <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                                                    {filteredCustomers.length > 0 ? (
                                                        filteredCustomers.map(c => (
                                                            <div
                                                                key={c._id}
                                                                onClick={() => selectCustomer(c)}
                                                                className="px-4 py-2 hover:bg-white/5 cursor-pointer border-b border-gray-700/50 last:border-0 flex justify-between items-center group"
                                                            >
                                                                <div>
                                                                    <p className="text-sm text-white font-medium group-hover:text-amber-400 transition-colors">{c.name}</p>
                                                                    <p className="text-[10px] text-slate-500">{c.email || 'Sin email'}</p>
                                                                </div>
                                                                <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">{c.phone}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                                            No encontrado. <span className="text-amber-500 cursor-pointer hover:underline" onClick={() => setShowSuggestions(false)}>Crear nuevo</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Teléfono</label>
                                            <input className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Contacto" />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                {/* Section: Items (Multi-Row) */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                        <Icon name="Package" size={14} /> Ítems del Pedido
                                    </h4>

                                    {/* List of Added Items */}
                                    {form.items.length > 0 && (
                                        <div className="space-y-2 mb-4">
                                            {form.items.map((it, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5 text-sm">
                                                    <div>
                                                        <span className="text-amber-500 font-bold mr-2">{it.quantity}x</span>
                                                        <span className="text-white font-medium">{getKegSize(it.kegId)}</span>
                                                        <span className="text-slate-500 mx-2">•</span>
                                                        <span className="text-slate-300">{getBeerName(it.beerId)}</span>
                                                        {it.barrelIdsString && <div className="text-xs text-slate-500 font-mono mt-0.5">IDs: {it.barrelIdsString}</div>}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {it.unitPrice > 0 && <span className="text-slate-400 text-xs">${(it.quantity * it.unitPrice).toLocaleString()}</span>}
                                                        <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                                            <Icon name="Trash" size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Item Form */}
                                    <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Estilo de Cerveza</label>
                                                <select className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={currentItem.beerId} onChange={e => setCurrentItem({ ...currentItem, beerId: e.target.value })}>
                                                    <option value="">-- Seleccionar Cerveza --</option>
                                                    {beers.map(b => (
                                                        <option key={b._id} value={b._id}>{b.name} ({b.style})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Tám. Barril</label>
                                                <select className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={currentItem.kegId} onChange={e => handleKegChange(e.target.value)}>
                                                    <option value="">-- Seleccionar Tamaño --</option>
                                                    {kegs.map(k => (
                                                        <option key={k._id} value={k._id} disabled={!item && k.stock <= 0}>
                                                            {k.size} (Stock: {k.stock})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Cantidad</label>
                                                <input type="number" min="1" className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={currentItem.quantity} onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">N° Barril(es)</label>
                                                <input className="input-dark w-full px-4 py-2 text-sm rounded-lg font-mono text-slate-300"
                                                    value={currentItem.barrelIdsString}
                                                    onChange={e => setCurrentItem({ ...currentItem, barrelIdsString: e.target.value })}
                                                    placeholder="Ej: 101, 105..."
                                                    title="Separa múltiples IDs con comas"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 items-end">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Precio Unitarios</label>
                                                <input
                                                    type="number"
                                                    className="input-dark w-full px-3 py-2 text-sm rounded-lg text-slate-400 bg-slate-900/50 cursor-not-allowed"
                                                    value={currentItem.unitPrice}
                                                    readOnly={true}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <button type="button" onClick={addItem} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full h-10 border border-white/5">
                                                + Agregar Ítem
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total Display */}
                                    <div className="flex justify-between items-center bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 mt-2">
                                        <span className="text-emerald-400 text-sm font-bold uppercase">Monto Total</span>
                                        <div className="w-1/3">
                                            <input
                                                type="number"
                                                className="input-dark w-full px-3 py-1 text-sm rounded-lg font-bold text-white bg-transparent border-0 text-right focus:ring-0 cursor-not-allowed"
                                                readOnly={true}
                                                value={form.amount}
                                                placeholder="$0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Logistics & Payment */}
                            <div className="space-y-6">
                                {/* Section: Logística */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                        <Icon name="Truck" size={14} /> Logística
                                    </h4>
                                    <div className="space-y-4">
                                        {/* Row 1: Pickup */}
                                        <div className="bg-slate-800/20 p-3 rounded-lg border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="checkPickedUp"
                                                        className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                                                        checked={form.status === 'Retirado' || form.status === 'Devuelto'}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setForm(prev => ({ ...prev, status: 'Retirado', pickupDate: today }));
                                                            } else {
                                                                setForm(prev => ({ ...prev, status: 'Reservado' }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor="checkPickedUp" className="text-sm font-bold text-white cursor-pointer select-none">
                                                        Confirmar Retiro
                                                    </label>
                                                </div>
                                                {(form.status === 'Retirado' || form.status === 'Devuelto') && (
                                                    <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                                        Retirado
                                                    </span>
                                                )}
                                            </div>

                                            {(form.status === 'Retirado' || form.status === 'Devuelto') && (
                                                <div className="ml-6 animate-in slide-in-from-top-2 duration-200">
                                                    <label className="text-[10px] font-medium text-slate-400 mb-1 block">¿Cuándo se retiró?</label>
                                                    <input
                                                        type="date"
                                                        min={item ? dateToInput(item.createdAt) : today}
                                                        className="input-dark w-full px-3 py-1.5 text-sm rounded-lg"
                                                        required
                                                        value={form.pickupDate}
                                                        onChange={e => setForm({ ...form, pickupDate: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Row 2: Return */}
                                        {(form.status === 'Retirado' || form.status === 'Devuelto') && (
                                            <div className="bg-slate-800/20 p-3 rounded-lg border border-white/5 animate-in slide-in-from-top-2 duration-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="checkReturned"
                                                            className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
                                                            checked={form.status === 'Devuelto'}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setForm(prev => ({ ...prev, status: 'Devuelto', returnDate: today }));
                                                                } else {
                                                                    setForm(prev => ({ ...prev, status: 'Retirado' }));
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor="checkReturned" className="text-sm font-bold text-white cursor-pointer select-none">
                                                            Confirmar Devolución
                                                        </label>
                                                    </div>
                                                    {form.status === 'Devuelto' && (
                                                        <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                                            Devuelto
                                                        </span>
                                                    )}
                                                </div>

                                                {form.status === 'Devuelto' && (
                                                    <div className="ml-6 animate-in slide-in-from-top-2 duration-200">
                                                        <label className="text-[10px] font-medium text-slate-400 mb-1 block">¿Cuándo se devolvió?</label>
                                                        <input
                                                            type="date"
                                                            min={form.pickupDate}
                                                            className="input-dark w-full px-3 py-1.5 text-sm rounded-lg border-emerald-500/30"
                                                            required
                                                            value={form.returnDate}
                                                            onChange={e => setForm({ ...form, returnDate: e.target.value })}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-white/5"></div>

                                {/* Section: Pago */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                        <Icon name="CreditCard" size={14} /> Pago
                                    </h4>
                                    <div className="bg-slate-800/30 p-4 rounded-xl space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Método</label>
                                            <select className="input-dark w-full px-4 py-2 text-sm rounded-lg" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                                                <option value="Efectivo">Efectivo</option>
                                                <option value="Transferencia">Transferencia</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="isPaid" className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer" checked={form.isPaid} onChange={e => setForm({ ...form, isPaid: e.target.checked })} />
                                            <label htmlFor="isPaid" className="text-sm text-white font-medium cursor-pointer select-none">
                                                ¿Pago Completado?
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Notas</label>
                                    <textarea className="input-dark w-full px-4 py-3 text-sm rounded-lg resize-none h-20" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observaciones..." />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6">
                            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm text-slate-400 hover:text-white font-medium transition-colors">Cancelar</button>
                            <button type="submit" className="px-8 py-2.5 text-sm btn-primary shadow-lg shadow-amber-500/20">Guardar Registro</button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
};

export default RentalManager;
