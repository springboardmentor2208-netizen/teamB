import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/view-complaints", label: "View Complaints" },
    { to: "/dashboard/profile", label: "Profile" },
    ...(location.pathname !== "/dashboard/report-issue"
      ? [{ to: "/dashboard/report-issue", label: "Report Issue" }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-30 flex justify-center bg-gradient-to-b from-[#F8F9FF]/80 via-[#F8F9FF]/60 to-transparent backdrop-blur-2xl">
      <div className="mt-3 mb-2 w-[94%] max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-[0_18px_50px_rgba(79,70,229,0.12)] backdrop-blur-2xl px-5 sm:px-7 py-3">

          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-10 h-28 w-28 rounded-full bg-rose-400/15 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">

            {/* ── Left: Logo + Nav ── */}
            <div className="flex items-center gap-6 sm:gap-8">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <span className="text-sm sm:text-[15px] font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent select-none">
                  CleanStreet
                </span>
              </Link>

              {/* Vertical divider */}
              {user && (
                <span className="hidden sm:block h-4 w-px bg-slate-200" />
              )}

              {/* Nav links */}
              {user && (
                <div className="hidden sm:flex items-center gap-1">
                  {navLinks.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/dashboard"}
                      className={({ isActive }) =>
                        `relative px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
                        ${isActive
                          ? "text-indigo-600 bg-indigo-50/70"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {label}
                          {/* Active dot indicator */}
                          {isActive && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Auth controls ── */}
            <div className="flex items-center gap-2.5">

              {/* Guest */}
              {!user && (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-semibold border transition-all duration-200
                       hover:-translate-y-0.5
                       ${isActive
                        ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                        : "border-slate-200 bg-white/60 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100/60"
                      }`
                    }
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-200
                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300/40
                       ${isActive
                        ? "bg-violet-600 text-white shadow-[0_8px_20px_rgba(109,40,217,0.35)]"
                        : "bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.28)] hover:bg-indigo-700"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}

              {/* Authenticated */}
              {user && (
                <>
                  {/* User pill */}
                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/50 px-3 py-1.5">
                    {/* Avatar initial */}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 shrink-0">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-600 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[13px] font-semibold border border-rose-100 bg-white/50 text-rose-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 hover:shadow-md hover:shadow-rose-100/60"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
