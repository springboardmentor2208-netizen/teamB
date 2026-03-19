import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [uRes, cRes] = await Promise.all([adminApi.getAllUsers(), adminApi.getAllComplaints()]);
      setUsers(uRes.data || []);
      setAllComplaints(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserComplaints = (userId) => {
    if (!allComplaints) return [];
    return allComplaints.filter(c => (c.user_id?._id || c.user_id) === userId);
  };

  const getRoleStyle = (role) => {
    const r = role?.toLowerCase();
    if (r === "admin") return "bg-rose-50 text-rose-600 border-rose-100";
    if (r === "volunteer") return "bg-indigo-50 text-indigo-600 border-indigo-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] antialiased text-slate-900 overflow-hidden">

      {/* --- Left Side: Slim User List (30% Width) --- */}
      <div className={`flex flex-col gap-3 transition-all duration-500 overflow-y-auto pr-2 custom-scrollbar ${selectedUser ? 'w-[30%]' : 'w-full'}`}>
        <div className="flex items-center justify-between px-2 mb-2 sticky top-0 bg-slate-50 z-10 py-1">
          <h1 className="text-xl font-bold tracking-tight">Community</h1>
          <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-1 rounded-md uppercase">
            {users.length} Users
          </span>
        </div>

        {users.map((u) => {
          const count = getUserComplaints(u._id).length;
          const isSelected = selectedUser?._id === u._id;
          return (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100'
                  : 'bg-white border-slate-100 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={u.profile_photo || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
                  className={`h-10 w-10 rounded-xl object-cover border-2 ${isSelected ? 'border-white/20' : 'border-transparent'}`}
                />
                <div className="truncate">
                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{u.name}</p>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{u.email}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* --- Right Side: Clean Profile Detail (70% Width) --- */}
      {selectedUser && (
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
            <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getRoleStyle(selectedUser.role)}`}>
              {selectedUser.role} Account
            </span>
            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-rose-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 pt-6 custom-scrollbar">
            {/* Identity Hero */}
            <div className="flex items-center gap-8 mb-12">
              <div className="relative shrink-0">
                <img
                  src={selectedUser.profile_photo || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=6366f1&color=fff`}
                  className="h-28 w-28 rounded-[1.5rem] object-cover shadow-md ring-4 ring-slate-50"
                  alt=""
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></span>
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">{selectedUser.name}</h2>
                <p className="text-lg text-slate-400 font-medium">{selectedUser.email}</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-widest border border-emerald-100">Verified Member</span>
                  <span className="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-widest border border-slate-100">{selectedUser.phone || "No Phone"}</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-slate-900 p-6 rounded-3xl flex flex-col justify-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Submissions</p>
                <p className="text-4xl font-black text-white leading-none">{getUserComplaints(selectedUser._id).length}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Location Region</p>
                <p className="text-lg font-bold text-slate-700 truncate">{selectedUser.location || "Not Provided"}</p>
              </div>
            </div>

            {/* History Feed */}
            <div className="space-y-4 pb-10">
              <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] mb-4">Complaint History</p>
              {getUserComplaints(selectedUser._id).length > 0 ? (
                getUserComplaints(selectedUser._id).map((comp) => (
                  <div key={comp._id} className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-400 transition-all flex justify-between items-center group shadow-sm hover:shadow-md">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {comp.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">
                        Posted on {new Date(comp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase text-slate-400 shrink-0 border border-slate-50">
                      {comp.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">No complaints shared yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;