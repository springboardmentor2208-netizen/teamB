import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi.js";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await authApi.forgotPassword({ email: form.email });
      setMessage("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authApi.verifyOTP({ email: form.email, otp: form.otp });
      setMessage("OTP verified");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await authApi.resetPassword({ email: form.email, otp: form.otp, newPassword: form.newPassword });
      setMessage("Password reset successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-1">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Forgot Password</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">CleanStreet Portal</p>
        </div>

        <div className="rounded-[2rem] border border-white bg-white/80 shadow-[0_15px_35px_rgba(79,70,229,0.06)] backdrop-blur-xl px-6 py-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-50 bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-50 bg-green-50 px-3 py-2 text-[11px] text-green-600">
              {message}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
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
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  OTP
                </label>
                <input
                  className="rounded-xl border border-slate-100 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                  name="otp"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Verify OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  New Password
                </label>
                <input
                  className="rounded-xl border border-slate-100 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  Confirm Password
                </label>
                <input
                  className="rounded-xl border border-slate-100 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Reset Password
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            Remember your password?{" "}
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

export default ForgotPassword;