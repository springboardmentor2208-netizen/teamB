import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  const linkBase =
    "text-xs sm:text-sm font-medium transition-colors duration-150";
  const pillBase =
    "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition transform duration-150";

  return (
    <nav className="sticky top-0 z-30 flex justify-center bg-gradient-to-b from-[#F8F9FF]/80 via-[#F8F9FF]/60 to-transparent backdrop-blur-2xl">
      <div className="mt-3 mb-2 w-[94%] max-w-5xl">


        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-[0_18px_50px_rgba(79,70,229,0.15)] backdrop-blur-2xl px-4 sm:px-6 py-2 sm:py-2.5">

          <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-10 h-28 w-28 rounded-full bg-rose-400/15 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">


            {/* left side */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                to="/"
                className="text-sm sm:text-base font-semibold tracking-[0.18em] uppercase"
              >
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  CleanStreet
                </span>
              </Link>

              {user && (
                <div className="hidden sm:flex items-center gap-3">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? "text-indigo-600" : "text-slate-500"
                      } hover:text-indigo-700`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/dashboard/profile"
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? "text-indigo-600" : "text-slate-500"
                      } hover:text-indigo-700`
                    }
                  >
                    Profile
                  </NavLink>

                  {/* NEW: Report Issue Button */}
                  <NavLink //addreport nav path here(Routes)
                    to="/report-issue"
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? "text-indigo-600" : "text-slate-500"
                      } hover:text-indigo-700
                }`
                    }
                  >
                    Report Issue
                  </NavLink>
                </div>
              )}
            </div>

            {/* right side */}
            <div className="flex items-center gap-3">
              {!user && (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${pillBase} border border-indigo-100 bg-white/50 text-slate-700 hover:-translate-y-0.5 hover:shadow-lg ${isActive ? "border-indigo-400 text-indigo-600" : ""
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `${pillBase} bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 hover:bg-indigo-700 ${isActive ? "bg-violet-600" : ""
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}

              {user && (
                <>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                    {user.name}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className={`${pillBase} border border-rose-100 bg-white/50 text-rose-600 hover:-translate-y-0.5 hover:bg-rose-50`}
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