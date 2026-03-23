import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { issueApi } from "../api/issueApi";

const StatusBadge = ({ status }) => {
  const config = {
    received: "bg-slate-100 text-slate-500 border-slate-200",
    in_review: "bg-amber-50 text-amber-600 border-amber-100",
    in_progress: "bg-blue-50 text-blue-600 border-blue-100",
    resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${config[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const stages = ["received", "in_review", "in_progress", "resolved"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await adminApi.getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  const updateStatus = async (id, status) => {
    await issueApi.updateIssueStatus(id, status);
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c))
    );
    if (selectedComplaint?._id === id) {
      setSelectedComplaint((prev) => ({ ...prev, status }));
    }
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-140px)] overflow-hidden antialiased font-sans">

      {/* --- Left Side: Complaint List --- */}
      <div className={`flex flex-col gap-4 transition-all duration-500 overflow-y-auto pr-2 custom-scrollbar ${selectedComplaint ? "w-[40%]" : "w-full"}`}>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="p-6">Complaint Details</th>
                  {!selectedComplaint && <th className="p-6 text-center">Workflow Stage</th>}
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {complaints.map((c) => {
                  const isSelected = selectedComplaint?._id === c._id;
                  return (
                    <tr
                      key={c._id}
                      onClick={() => setSelectedComplaint(c)}
                      className={`cursor-pointer transition-all ${
                        isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className={`font-black text-sm ${isSelected ? 'text-indigo-600' : 'text-slate-800'}`}>
                            {c.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                            {c.address}
                          </p>
                          <button className="mt-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 hover:text-indigo-700 transition-colors">
                             <span className="text-xs">📸</span> View Picture
                          </button>
                        </div>
                      </td>

                      {/* --- REFINED CHECKBOX STYLE PIPELINE --- */}
                      {!selectedComplaint && (
                        <td className="p-6">
                          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {stages.map((s, i) => {
                              const active = stages.indexOf(c.status) >= i;
                              return (
                                <div key={s} className="flex items-center">
                                  <button
                                    onClick={() => updateStatus(c._id, s)}
                                    title={s.replace('_', ' ')}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border-[1.5px] ${
                                      active
                                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 scale-110"
                                      : "bg-white border-indigo-200 text-transparent hover:border-indigo-400 hover:ring-4 hover:ring-indigo-50"
                                    }`}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </button>
                                  {i < 3 && (
                                    <div className={`w-6 h-[1.5px] mx-0.5 rounded-full transition-colors duration-500 ${
                                      active && stages.indexOf(c.status) > i ? "bg-indigo-400" : "bg-slate-100"
                                    }`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      )}

                      <td className="p-6 text-right">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Right Side: Details Sidebar (remains as high-end version) --- */}
      {selectedComplaint && (
        <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 zoom-in-95 duration-500">
          <div className="p-8 pb-4 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full">
              Case File: #{selectedComplaint._id.slice(-6)}
            </span>
            <button onClick={() => setSelectedComplaint(null)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
            <div className="mb-8 group">
              <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] mb-4 px-2">Evidence Photo</p>
              <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-slate-50 shadow-xl aspect-video">
                {selectedComplaint.photo ? (
                  <img src={selectedComplaint.photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400"><span className="text-4xl mb-2">📷</span><p className="text-xs font-bold">No image provided</p></div>
                )}
              </div>
            </div>

            <div className="mb-10 text-left px-2">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-tight mb-3">{selectedComplaint.title}</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">{selectedComplaint.description || "No description."}</p>
            </div>

            {/* Reporter Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl mb-10 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Reporter Information</p>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-black border border-white/10">{selectedComplaint.user_id?.name?.charAt(0) || "C"}</div>
                        <div className="text-left">
                            <h4 className="text-lg font-black tracking-tight">{selectedComplaint.user_id?.name || "Citizen"}</h4>
                            <p className="text-indigo-300/60 text-xs font-medium">{selectedComplaint.user_id?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions with refined border */}
            <div className="px-2">
                <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] mb-6">Update Stage</p>
                <div className="grid grid-cols-2 gap-3 pb-10">
                    {stages.map((s) => (
                        <button
                            key={s}
                            onClick={() => updateStatus(selectedComplaint._id, s)}
                            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-[1.5px] ${
                                selectedComplaint.status === s
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "bg-white border-indigo-100 text-indigo-400 hover:border-indigo-400 hover:text-indigo-600"
                            }`}
                        >
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;