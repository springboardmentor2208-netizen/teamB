import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Grab the logout function from your context

  const handleLogout = () => {
    logout(); // Clear tokens/state
    navigate("/login"); // Redirect to login page
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/complaints", label: "Complaints", icon: "📬" },
    { path: "/admin/users", label: "Users", icon: "👥" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 shadow-2xl flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">A</div>
          <h2 className="text-xl font-bold tracking-tight text-white">Admin<span className="text-indigo-400">Hub</span></h2>
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* --- LOGOUT SECTION --- */}
        <div className="pt-6 border-t border-slate-800 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 group"
          >
            <span className="group-hover:rotate-12 transition-transform">🚀</span>
            <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 flex items-center px-8 justify-between">
          <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Administrator Access</span>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-900 leading-none">Admin User</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Verified Session</p>
             </div>
             <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-indigo-600 text-xs shadow-sm">AD</div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;