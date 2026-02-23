import { useEffect, useState } from "react";
import { authApi } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.getProfile();
        setForm({
          name: data.name || "",
          email: data.email || "",
          location: data.location || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authApi.updateProfile(form);
      const token = localStorage.getItem("cs_token");
      login({ ...user, ...data }, token);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/*  profile form */}
      <div className="w-full max-w-2xl">

        <div className="mb-6 px-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Profile Settings</h1>
          <p className="text-[11px] text-slate-500">Update your personal information</p>
        </div>

        {/* Card*/}
        <div className="rounded-[2rem] border border-white bg-white/80 shadow-[0_15px_35px_rgba(79,70,229,0.08)] backdrop-blur-xl px-6 py-8 sm:px-8">

          {/* Profile Image*/}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-15 transition duration-300"></div>
              <img
                src="https://i.pinimg.com/736x/7f/e6/f3/7fe6f3902403f51c3f31c066e1c5a455.jpg"
                alt="Profile"
                className="relative h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm"
              />
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md hover:bg-indigo-700 transition-all border-2 border-white active:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Full Name</label>
              <input
                className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Email</label>
              <input
                className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Location</label>
              <input
                className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Phone</label>
              <input
                className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-all"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>

            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-full bg-indigo-600 px-10 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-white bg-white/95 shadow-2xl backdrop-blur-xl p-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800">Profile Updated!</h3>
            <p className="text-sm text-slate-600">Your profile changes have been saved successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;