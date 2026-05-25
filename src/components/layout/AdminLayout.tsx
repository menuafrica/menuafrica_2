import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  MenuSquare, 
  PenTool, 
  Smile, 
  BarChart2, 
  QrCode, 
  Palette, 
  CreditCard, 
  Settings, 
  Users, 
  LogOut,
  Search,
  Bell,
  Menu as MenuIcon
} from 'lucide-react';
import clsx from 'clsx';

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
    { path: '/admin/bibin', label: 'Bibin AI', icon: Sparkles },
    { path: '/admin/menus', label: 'Mes Menus', icon: MenuSquare },
    { path: '/admin/menu', label: 'Menu Builder', icon: PenTool },
    { path: '/admin/mavada', label: 'Mavada Studio', icon: Smile },
    { path: '/admin/insights', label: 'Statistiques', icon: BarChart2 },
    { path: '/admin/qrcode', label: 'QR Studio', icon: QrCode },
    { path: '/admin/brand', label: 'Identité Visuelle', icon: Palette },
    { path: '/admin/subscriptions', label: 'Abonnement', icon: CreditCard },
    { path: '/admin/settings', label: 'Paramètres', icon: Settings },
    { path: '/admin/team', label: 'Équipe', icon: Users }
  ];

  const getPageTitle = (pathname: string) => {
    const link = sidebarLinks.find(l => 
      l.exact ? pathname === l.path : pathname.startsWith(l.path) && l.path !== '/admin'
    );
    return link ? link.label : 'Tableau de bord';
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 transform",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6">
          <div className="font-playfair font-black text-2xl tracking-tighter text-slate-900 flex items-center gap-1">
            <span className="bg-[#8C6239] text-white px-2 py-0.5 rounded-md text-xl">M</span>
            <span>enuAfrica</span>
          </div>
          <div className="mt-8 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 pl-2">
            KU NZO
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {sidebarLinks.map(link => {
            const isActive = link.exact 
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path) && link.path !== '/admin';
            
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all relative",
                 // "hover:bg-slate-50 hover:text-slate-900 text-slate-500",
                  isActive 
                    ? "bg-[#FFF8F3] text-[#D97706]" 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <link.icon className={clsx("w-5 h-5", isActive ? "text-[#D97706]" : "text-slate-400")} />
                {link.label}
                {link.label === 'Mavada Studio' && isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            SE DÉCONNECTER
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-20 px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                TABLEAU DE BORD
              </span>
              <h1 className="text-2xl font-playfair font-bold text-slate-800">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all w-64"
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold shadow-sm">
              V
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

