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

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await authApi.getProfile();

        setForm({
          name: data.name || "",
          email: data.email || "",
          location: data.location || "",
          phone: data.phone || "",
        });

        setPreview(data.profile_photo || "");
      } catch {
        setError("Failed to load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("phone", form.phone);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const { data } = await authApi.updateProfile(formData);

      const token = localStorage.getItem("cs_token");
      login({ ...user, ...data }, token);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);

    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-2xl">

        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={preview || "https://via.placeholder.com/150"}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
              />

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Click image to change
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-xs uppercase text-slate-400 mb-1">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase text-slate-400 mb-1">
                Email
              </label>
              <input
                value={form.email}
                disabled
                className="rounded-xl border border-slate-200 px-4 py-2 bg-slate-100"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase text-slate-400 mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase text-slate-400 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-4 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full text-white font-semibold ${
                  loading
                    ? "bg-indigo-300"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h3 className="font-semibold text-lg mb-2">
              Profile Updated
            </h3>
            <p className="text-sm text-slate-500">
              Your profile image and details are saved.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;