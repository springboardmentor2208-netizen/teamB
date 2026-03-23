import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// --- Custom Icon Component for Modern Look ---
const Icon = ({ name }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    complaints: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="2" /></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></>,
    reports: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { id: "/admin/dashboard", label: "Overview", icon: "dashboard" },
    { id: "/admin/complaints", label: "Complaints", icon: "complaints" },
    { id: "/admin/users", label: "Users", icon: "users" },
    { id: "/admin/reports", label: "Analytics", icon: "reports" },
  ];

  // Logic to determine the header title based on current path
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return { title: "Admin Dashboard", sub: "System Overview" };
    if (path.includes("complaints")) return { title: "Issue Pipeline", sub: "Manage community reports" };
    if (path.includes("users")) return { title: "Community Members", sub: "User directory & roles" };
    if (path.includes("reports")) return { title: "Data Analytics", sub: "Regional & performance reports" };
    return { title: "Admin Panel", sub: "Welcome back" };
  };

  const header = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased flex">
      {/* --- SIDEBAR --- */}
      <aside
        style={{ width: sidebarOpen ? 260 : 80 }}
        className="fixed left-0 top-0 h-full bg-[#0f172a] transition-all duration-500 ease-in-out z-40 overflow-hidden flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.04)]"
      >
        {/* Logo Section */}
        <div className="p-6 mb-4 flex items-center gap-4 h-24 shrink-0 overflow-hidden">
          <div className="w-12 h-12 shrink-0">
            <img
              src="/image.png"
              alt="App Logo"
              className="w-full h-full object-contain rounded-xl shadow-lg ring-2 ring-white/10"
            />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="text-white font-black text-xl tracking-tighter leading-none">CleanStreet</span>
              <span className="text-indigo-400/60 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5">Admin Hub</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.id;
            return (
              <Link
                key={item.id}
                to={item.id}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <div className={`${isActive ? "text-white" : "group-hover:text-indigo-400 transition-colors"}`}>
                  <Icon name={item.icon} />
                </div>
                {sidebarOpen && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                {isActive && (
                  <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 space-y-2 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all group"
          >
            <div className="group-hover:rotate-12 transition-transform">
              <Icon name="logout" />
            </div>
            {sidebarOpen && <span className="text-sm font-bold">Sign Out</span>}
          </button>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center py-2 text-slate-500 hover:text-white transition-colors"
          >
            <div className="bg-white/5 p-2 rounded-xl active:scale-90 transition-transform">
              {sidebarOpen ? "✕" : "☰"}
            </div>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div
        style={{ marginLeft: sidebarOpen ? 260 : 80 }}
        className="transition-all duration-500 flex-1 min-h-screen flex flex-col"
      >
        {/* Sticky Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{header.title}</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{header.sub}</p>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-100">
              <Icon name="bell" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none capitalize">{user?.name || "Admin"}</p>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter mt-1">Online Now</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">
                {user?.name?.substring(0, 2).toUpperCase() || "AD"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Rendered Here */}
        <main className="p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;