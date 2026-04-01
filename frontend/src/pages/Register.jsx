import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    role: "user",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
  if (user) {
    navigate("/dashboard"); //redirect if already logged in
  }
}, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!/^\d{10}$/.test(form.phone)) {
    return setError("Phone number must be exactly 10 digits");
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{6,}$/;

  if (!passwordRegex.test(form.password)) {
    return setError(
      "Password must be at least 6 characters and include letters & numbers"
    );
  }

    try {
      await authApi.register(form);
      setMessage("OTP sent to your email for verification");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authApi.verifyRegistrationOTP({ email: form.email, otp });
      setMessage("Email verified successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  

  return (
    <div className="w-full flex flex-col items-center py-1 px-4">
      <div className="w-full max-w-md">

        <div className="mb-2 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Create Account</h1>
          <p className="text-[10px] text-black font-bold uppercase tracking-widest">Join the community</p>
        </div>

        {/* Compact Card with px-6 py-8 */}
        <div className="rounded-[2rem] border border-white bg-white/80 shadow-[0_15px_35px_rgba(79,70,229,0.06)] backdrop-blur-xl px-6 py-8">

          {error && (
            <div className=" rounded-xl border border-red-50 bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-50 bg-green-50 px-3 py-2 text-[11px] text-green-600">
              {message}
            </div>
          )}

          {step === 1 && (

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Full Name</label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex : Raju"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Username</label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Ex : Raju123"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Email</label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Phone</label>
              <input
  name="phone"
  value={form.phone}
  maxLength="10"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    setForm((prev) => ({ ...prev, phone: value }));
  }}
  placeholder="Optional"
  className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm"
/>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Location</label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ex : Karimnagar"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all appearance-none cursor-pointer"
              >
                <option value="user">Citizen</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 ml-1">Password</label>
              <input
                className="rounded-xl border border-slate-100 bg-white/50 px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="sm:col-span-2 ">
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Create Account
              </button>
            </div>
          </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  Enter OTP sent to {form.email}
                </label>
                <input
                  className="rounded-xl border border-slate-100 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Verify Email
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link
              to="/login"
              style={{ textDecoration: 'none' }}
              className="text-indigo-600 font-bold no-underline hover:text-indigo-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;