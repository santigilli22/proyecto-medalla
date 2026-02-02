import { useState, useEffect, useMemo } from 'react';
import { getAnalyticsKPI, getAnalyticsSales, getAnalyticsProducts, getPaymentStats, getTopCustomers, getRentals } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Icon from '../Icon';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

const ReportsDashboard = () => {
    // Stats Data
    const [kpi, setKpi] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);

    // Table Data & Filters
    const [allRentals, setAllRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('All'); // All, Retirado, Devuelto, Pendiente
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [k, s, p, pay, top, rentals] = await Promise.all([
                    getAnalyticsKPI(),
                    getAnalyticsSales(),
                    getAnalyticsProducts(),
                    getPaymentStats(),
                    getTopCustomers(),
                    getRentals()
                ]);
                setKpi(k);
                setSalesData(s);
                setProductData(p);
                setPaymentData(pay);
                setTopCustomers(top);
                setAllRentals(rentals);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Filter Logic
    const filteredRentals = useMemo(() => {
        return allRentals.filter(r => {
            // 1. Status
            if (statusFilter !== 'All' && r.status !== statusFilter) return false;

            // 2. Search
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchName = r.customerName?.toLowerCase().includes(q);
                const matchContact = r.contact?.includes(q);
                if (!matchName && !matchContact) return false;
            }

            // 3. Date Range (Pickup Date)
            if (dateRange.start) {
                if (new Date(r.pickupDate) < new Date(dateRange.start)) return false;
            }
            if (dateRange.end) {
                // End date inclusive (until end of day)
                const end = new Date(dateRange.end);
                end.setHours(23, 59, 59, 999);
                if (new Date(r.pickupDate) > end) return false;
            }

            return true;
        }).sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
    }, [allRentals, statusFilter, searchQuery, dateRange]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-amber-500 animate-pulse">
            <Icon name="Loader" className="animate-spin mr-2" /> Cargando Reportes...
        </div>
    );

    return (
        <div className="space-y-6 print:space-y-4">
            <style>{`
                @media print {
                    @page { margin: 0.5cm; size: A4 portrait; }
                    html, body { height: 100%; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
                    
                    /* Hide UI */
                    aside, header, button, .no-print, input, select { display: none !important; }
                    
                    /* Layout Reset */
                    main { margin: 0 !important; padding: 0 !important; width: 100% !important; min-height: 100vh; }
                    .bg-slate-900, .bg-slate-950, .bg-slate-800\\/50, .bg-slate-800\\/40, .bg-slate-900\\/50 { 
                        background: white !important; 
                        border: 1px solid #ddd !important;
                        box-shadow: none !important;
                        color: black !important;
                    }
                    
                    /* Typography */
                    .text-white { color: black !important; }
                    .text-slate-300, .text-slate-400 { color: #555 !important; }
                    .text-emerald-400 { color: #059669 !important; }
                    
                    /* Charts & Grid */
                    .print-section { break-inside: avoid; page-break-inside: avoid; }
                    .h-72 { height: 180px !important; }
                    .grid-cols-1.lg\\:grid-cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                    .grid-cols-1.md\\:grid-cols-2 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.5rem; } /* 4 col kpi */

                    /* Table */
                    table { width: 100%; border-collapse: collapse; font-size: 9px !important; }
                    th, td { border: 1px solid #eee; padding: 4px !important; }
                    thead { background: #f0f0f0 !important; font-weight: bold; }
                    
                    /* Force scale if needed */
                     body { font-size: 10pt; }
                }
            `}</style>

            <div className="flex justify-between items-center no-print mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Reportes Avanzados</h2>
                    <p className="text-sm text-slate-400">Análisis detallado de operaciones y clientes.</p>
                </div>
                <button onClick={handlePrint} className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                    <Icon name="Printer" size={18} /> Imprimir Reporte
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ReportCard title="Ingresos Históricos" value={`$${kpi?.totalIncome?.toLocaleString('es-AR')}`} icon="DollarSign" color="text-emerald-400" />
                <ReportCard title="Alquileres Activos" value={kpi?.activeRentals} icon="Activity" color="text-blue-400" />
                <ReportCard title="Total Barriles" value={kpi?.totalKegs} icon="Database" color="text-purple-400" />
                <ReportCard title="Stock Crítico" value={kpi?.lowStockKegs} icon="AlertTriangle" color="text-red-400" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 print-section">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Icon name="BarChart3" size={18} className="text-amber-500" /> Ingresos por Mes
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} itemStyle={{ color: '#fbbf24' }} formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
                                <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 print-section">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Icon name="PieChart" size={18} className="text-emerald-500" /> Productos Top
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                                    {productData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 print-section">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Icon name="CreditCard" size={18} className="text-blue-500" /> Métodos de Pago
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8">
                                    {paymentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Customers */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 print-section">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Icon name="UserCheck" size={18} className="text-purple-500" /> Mejores Clientes
                    </h3>
                    <div className="space-y-4">
                        {topCustomers.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{c.name}</p>
                                        <p className="text-xs text-slate-500">{c.count} Alquileres</p>
                                    </div>
                                </div>
                                <div className="text-emerald-400 font-bold text-sm">
                                    ${c.totalSpent.toLocaleString('es-AR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Table Filter Controlled */}
            <div className="mt-8 bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden print-section">
                <div className="p-4 border-b border-white/5 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Icon name="List" size={18} /> Detalle de Operaciones
                    </h3>

                    {/* Filters UI */}
                    <div className="flex flex-wrap items-center gap-2 no-print">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Todos los Estados</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Retirado">Retirado</option>
                            <option value="Devuelto">Devuelto</option>
                        </select>
                        <input
                            type="date"
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 text-slate-400"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-slate-500">-</span>
                        <input
                            type="date"
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 text-slate-400"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase font-medium text-xs sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Detalle</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRentals.map((r) => (
                                <tr key={r._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-300">
                                        {new Date(r.pickupDate).toLocaleDateString('es-AR')}
                                    </td>
                                    <td className="px-6 py-4 text-white font-bold">
                                        {r.customerName}
                                        <span className="block text-xs text-slate-500 font-normal">{r.contact}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        {r.items?.map((i, idx) => (
                                            <div key={idx} className="mb-1">
                                                {i.quantity}x {i.beer?.name || 'Cerveza'} ({i.keg?.size || 'Barril'})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${r.status === 'Devuelto' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                r.status === 'Retirado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-bold">
                                        ${r.amount?.toLocaleString('es-AR')}
                                    </td>
                                </tr>
                            ))}
                            {filteredRentals.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 italic">
                                        No se encontraron operaciones con estos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 bg-slate-900/50 border-t border-white/5 text-right text-xs text-slate-500">
                    Mostrando {filteredRentals.length} resultados
                </div>
            </div>
        </div>
    );
};

// Reusable card component
const ReportCard = ({ title, value, icon, color = "text-amber-400" }) => (
    <div className="bg-slate-800/40 p-5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/20 transition-all">
        <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
            <Icon name={icon} size={24} />
        </div>
    </div>
);

export default ReportsDashboard;
