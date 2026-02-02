import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import EventManager from '../components/admin/EventManager';
import PartnerManager from '../components/admin/PartnerManager';
import BeerManager from '../components/admin/BeerManager';
import KegManager from '../components/admin/KegManager';
import RentalManager from '../components/admin/RentalManager';
import CustomerManager from '../components/admin/CustomerManager';
import ReportsDashboard from '../components/admin/ReportsDashboard';
import DashboardSummary from '../components/admin/DashboardSummary';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [expandedMenus, setExpandedMenus] = useState({});

    // Mapping: URL hash -> Component
    const tabs = {
        '#overview': <DashboardSummary navigate={navigate} />,
        '#events': <EventManager />,
        '#beers': <BeerManager />,
        '#partners': <PartnerManager />,
        '#kegs': <KegManager />,
        '#rentals': <RentalManager />,
        '#customers': <CustomerManager />,
        '#reports': <ReportsDashboard />
    };

    // Default to overview if no hash or invalid hash
    const currentHash = location.hash || '#overview';
    const activeTab = tabs[currentHash] ? currentHash : '#overview';

    const menuItems = [
        { id: '#overview', label: 'Resumen', icon: 'LayoutGrid' },
        { id: '#reports', label: 'Reportes', icon: 'BarChart' },
        { id: '#events', label: 'Eventos', icon: 'Calendar' },
        { id: '#beers', label: 'Cervezas', icon: 'Beer' },
        { id: '#partners', label: 'Puntos de Venta', icon: 'MapPin' },
        {
            id: 'kegs-section',
            label: 'Barriles',
            icon: 'Package',
            children: [
                { id: '#kegs', label: 'Inventario' },
                { id: '#rentals', label: 'Alquileres' }
            ]
        },
        { id: '#customers', label: 'Clientes', icon: 'Users' },
    ];

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                navigate('/admin');
                return;
            }

            const pUser = JSON.parse(storedUser);
            setUser(pUser);

            // Auto-expand sections if active child
            const newExpanded = {};
            menuItems.forEach(item => {
                if (item.children) {
                    const hasActiveChild = item.children.some(child => child.id === activeTab);
                    if (hasActiveChild) newExpanded[item.id] = true;
                }
            });
            setExpandedMenus(prev => ({ ...prev, ...newExpanded }));

        } catch (err) {
            console.error("Dashboard Auth Error:", err);
            localStorage.clear();
            navigate('/admin');
        }
    }, [navigate, activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin');
    };

    const toggleMenu = (id) => {
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-4">
                <div className="text-amber-500 font-bold animate-pulse">Cargando Panel...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col fixed h-full z-10 overflow-y-auto custom-scrollbar">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold brand-font text-white">MEDALLA <span className="text-amber-500">ADMIN</span></h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => (
                        <div key={item.id}>
                            {item.children ? (
                                // Parent Item
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(item.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${(item.children.some(child => child.id === activeTab))
                                            ? 'text-white bg-white/5'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon name={item.icon} size={18} /> {item.label}
                                        </div>
                                        <Icon
                                            name="ChevronDown"
                                            size={14}
                                            className={`transition-transform duration-200 ${expandedMenus[item.id] ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Children */}
                                    {expandedMenus[item.id] && (
                                        <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                            {item.children.map(child => (
                                                <button
                                                    key={child.id}
                                                    onClick={() => navigate(child.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm border-l-2 ${activeTab === child.id
                                                        ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                                                        : 'border-transparent text-slate-500 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {child.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Standard Item
                                <NavItem
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeTab === item.id}
                                    onClick={() => navigate(item.id)}
                                />
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold text-xs shadow-lg shadow-amber-500/20">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-white leading-none">{user.username}</p>
                            <p className="text-slate-500 text-xs capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium">
                        <Icon name="LogOut" size={16} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            {activeTab === '#overview' && 'Resumen'}
                            {activeTab === '#events' && 'Gestión de Eventos'}
                            {activeTab === '#beers' && 'Catálogo de Cervezas'}
                            {activeTab === '#partners' && 'Puntos de Venta'}
                            {activeTab === '#kegs' && 'Gestión de Barriles (Inventario)'}
                            {activeTab === '#rentals' && 'Control de Alquileres'}
                            {activeTab === '#customers' && 'Base de Clientes (CRM)'}
                            {activeTab === '#reports' && 'Reportes Avanzados'}
                        </h1>
                        <p className="text-slate-400 text-sm">Bienvenido al panel de control.</p>
                    </div>
                </header>

                {/* Content Area */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 min-h-[500px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-20"></div>
                    {tabs[activeTab]}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/10 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
        <Icon name={icon} size={18} /> {label}
    </button>
);

export default AdminDashboard;
