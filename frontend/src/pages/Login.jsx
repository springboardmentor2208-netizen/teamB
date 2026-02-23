import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await authApi.login(form);
      login(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleDevLogin = () => {
    devLogin();
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="w-full flex flex-col items-center py-1">

      <div className="w-full max-w-sm">

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Sign In</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">CleanStreet Portal</p>
        </div>

        <div className="rounded-[2rem] border border-white bg-white/80 shadow-[0_15px_35px_rgba(79,70,229,0.06)] backdrop-blur-xl px-6 py-8">

          {error && (
            <div className="mb-5 rounded-xl border border-red-50 bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                Email
              </label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                Password
              </label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-widest">
              <span className="bg-white/0 px-2 text-slate-300 font-bold">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDevLogin}
            className="w-full rounded-full border border-dashed border-indigo-200 bg-indigo-50/20 py-2 text-[10px] font-bold text-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            Quick Dev Access
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            <Link
              to="/forgot-password"
              style={{ textDecoration: 'none' }}
              className="text-indigo-600 font-bold no-underline hover:text-indigo-700"
            >
              Forgot Password?
            </Link>
          </p>

          <p className="mt-2 text-center text-xs text-slate-400">
            New here?{" "}
            <Link
              to="/register"
              style={{ textDecoration: 'none' }}
              className="text-indigo-600 font-bold no-underline hover:text-indigo-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;