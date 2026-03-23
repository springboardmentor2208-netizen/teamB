import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [u, c] = await Promise.all([adminApi.getAllUsers(), adminApi.getAllComplaints()]);
      setUsers(u.data || []);
      setAllComplaints(c.data || []);
    };
    load();
  }, []);

  const getUserComplaints = (id) => allComplaints.filter(c => (c.user_id?._id || c.user_id) === id);

  return (
    <div className="flex gap-8 h-[calc(100vh-140px)] overflow-hidden antialiased font-sans">

      {/* --- Left Side: Attractive User List --- */}
      <div className={`flex flex-col gap-4 transition-all duration-500 overflow-y-auto pr-4 custom-scrollbar ${selectedUser ? 'w-[32%]' : 'w-full'}`}>
        <div className="flex items-center justify-between px-2 mb-2 sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md z-10 py-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Community</h1>
          <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {users.length} Members
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {users.map(u => {
            const isSelected = selectedUser?._id === u._id;
            const count = getUserComplaints(u._id).length;

            return (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`group cursor-pointer p-4 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center justify-between shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-600 shadow-indigo-200 scale-[1.02] z-10'
                    : 'bg-white border-white hover:border-indigo-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4 truncate">
                  <div className="relative shrink-0">
                    <img
                      src={u.profile_photo || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
                      className={`h-12 w-12 rounded-2xl object-cover transition-transform duration-500 ${isSelected ? 'ring-4 ring-white/20' : 'group-hover:scale-105'}`}
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                    )}
                  </div>
                  <div className="truncate text-left">
                    <p className={`text-sm font-black truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {u.name}
                    </p>
                    <p className={`text-[11px] font-medium truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {u.email}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-black min-w-[28px] h-7 flex items-center justify-center rounded-xl transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Right Side: High-End Profile Details --- */}
      {selectedUser && (
        <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden animate-in slide-in-from-right-10 zoom-in-95 duration-500">

          {/* Header Action */}
          <div className="p-8 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full">
                {selectedUser.role} Account
              </span>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
            {/* Identity Section */}
            <div className="flex items-center gap-8 mb-12">
              <div className="relative shrink-0">
                <img
                  src={selectedUser.profile_photo || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=6366f1&color=fff`}
                  className="h-32 w-32 rounded-[2.5rem] object-cover shadow-2xl ring-[12px] ring-slate-50"
                />
              </div>
              <div className="text-left">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight mb-1">
                  {selectedUser.name}
                </h2>
                <p className="text-lg text-slate-400 font-medium mb-4">{selectedUser.email}</p>
                <div className="flex gap-2">
                  <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-tighter">Verified Member</span>
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-tighter">{selectedUser.phone || "No Phone"}</span>
                </div>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-indigo-600 p-8 rounded-[2.2rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-center">
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Total Submissions</p>
                <p className="text-5xl font-black leading-none">{getUserComplaints(selectedUser._id).length}</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.2rem] border border-slate-100 flex flex-col justify-center">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Location Zone</p>
                <p className="text-xl font-black text-slate-800 leading-tight truncate">{selectedUser.location || "Unset"}</p>
              </div>
            </div>

            {/* Contribution History Feed */}
            <div className="space-y-4 pb-10">
              <h4 className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] mb-6 px-2">Contribution History</h4>
              {getUserComplaints(selectedUser._id).length > 0 ? (
                getUserComplaints(selectedUser._id).map(comp => (
                  <div key={comp._id} className="p-6 bg-white border border-slate-100 rounded-[1.8rem] flex justify-between items-center shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                    <div className="text-left min-w-0 flex-1 pr-4">
                      <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {comp.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                        Ref: {comp._id.slice(-6)}
                      </p>
                    </div>
                    <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg shrink-0">
                      {comp.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest italic">No records found</p>
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