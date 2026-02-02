import { useState, useEffect } from 'react';
import { getAnalyticsKPI, getAnalyticsSales, getAnalyticsProducts, getTopCustomers } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import Icon from '../Icon';

const DashboardSummary = ({ navigate }) => { // Accept navigate as prop for quick actions
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [kpi, sales, products, customers] = await Promise.all([
                    getAnalyticsKPI(),
                    getAnalyticsSales(),
                    getAnalyticsProducts(),
                    getTopCustomers()
                ]);
                setStats(kpi);
                setSalesData(sales);
                setProductData(products.slice(0, 5)); // Top 5
                setTopCustomers(customers);
            } catch (error) {
                console.error("Dashboard Load Error:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96 text-amber-500 animate-pulse">
            <Icon name="Loader" className="animate-spin mr-3" size={32} />
            <span className="text-xl font-bold">Cargando Resumen...</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Ingresos Totales"
                    value={`$${stats?.totalIncome?.toLocaleString('es-AR')}`}
                    icon="DollarSign"
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    trend="+12%" // Mock trend 
                />
                <KPICard
                    title="Alquileres Activos"
                    value={stats?.activeRentals}
                    icon="Activity"
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    trend="+5"
                />
                <KPICard
                    title="Total Barriles"
                    value={stats?.totalKegs}
                    icon="Database"
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
                <KPICard
                    title="Stock Bajo"
                    value={stats?.lowStockKegs}
                    icon="AlertTriangle"
                    color="text-red-400"
                    bg="bg-red-500/10"
                    action={() => navigate('#kegs')}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Area Chart (Large) */}
                <div className="lg:col-span-2 bg-slate-800/40 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Icon name="TrendingUp" size={20} className="text-amber-500" /> Tendencia de Ingresos
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="_id" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products Bar Chart (Small) */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Icon name="Beer" size={20} className="text-amber-500" /> Top Productos
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#94a3b8" width={100} fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20}>
                                    {productData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#d97706'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Customers & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Customers List */}
                <div className="lg:col-span-2 bg-slate-800/40 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Icon name="Users" size={20} className="text-blue-500" /> Mejores Clientes
                        </h3>
                        <button onClick={() => navigate('#customers')} className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">Ver Todos</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-slate-500 uppercase bg-white/5 rounded-lg">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Cliente</th>
                                    <th className="px-4 py-3">Alquileres</th>
                                    <th className="px-4 py-3 text-right rounded-r-lg">Total Gastado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {topCustomers.map((c, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                                                {i + 1}
                                            </span>
                                            {c.name}
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{c.count}</td>
                                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">${c.totalSpent.toLocaleString('es-AR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-2">Accesos Directos</h3>
                    <p className="text-slate-400 text-sm mb-6">Gestiona tu negocio rápidamente.</p>

                    <div className="space-y-3">
                        <button onClick={() => navigate('#rentals')} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]">
                            <Icon name="PlusCircle" size={20} /> Nuevo Alquiler
                        </button>
                        <button onClick={() => navigate('#customers')} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 transition-all hover:scale-[1.02]">
                            <Icon name="UserPlus" size={20} /> Registrar Cliente
                        </button>
                        <button onClick={() => navigate('#kegs')} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-white/10 transition-all hover:scale-[1.02]">
                            <Icon name="Package" size={20} /> Ver Inventario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, color, bg, action, trend }) => (
    <div
        onClick={action}
        className={`bg-slate-800/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${action ? 'cursor-pointer hover:border-amber-500/30' : ''}`}
    >
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bg} blur-2xl group-hover:blur-3xl transition-all`}></div>

        <div className="relative z-10 flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon name={icon} size={24} />
            </div>
            {trend && <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{trend}</span>}
        </div>

        <div className="relative z-10">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    </div>
);

export default DashboardSummary;
