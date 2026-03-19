import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { issueApi } from "../api/issueApi";

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await adminApi.getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    await issueApi.updateIssueStatus(id, status);
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c))
    );
  };

  const statusMap = [
    { key: 'received', label: 'Received' },
    { key: 'in_review', label: 'In Review' },
    { key: 'in_progress', label: 'Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
      {/* Header Section */}
      <div className="p-10 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Issue Pipeline</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium italic">Track and advance community tickets through the workflow.</p>
      </div>

      <div className="overflow-x-auto px-4">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-slate-400">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em]">Complaint Details</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-center">Workflow Stage</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="group transition-all duration-300">
                {/* Subject Cell */}
                <td className="bg-white border-y border-l border-slate-100 p-6 rounded-l-[2rem] group-hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {c.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded">
                        #{c._id.slice(-6)}
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium italic">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Progression Cell */}
                <td className="bg-white border-y border-r border-slate-100 p-6 rounded-r-[2rem] group-hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-center gap-1">
                    {statusMap.map((step, index) => {
                      const isCurrent = c.status === step.key;
                      const isPast = statusMap.findIndex(s => s.key === c.status) >= index;

                      return (
                        <div key={step.key} className="flex items-center">
                          <button
                            onClick={() => updateStatus(c._id, step.key)}
                            className={`relative h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all duration-300 border-2 ${
                              isCurrent
                                ? `bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105 z-10`
                                : isPast
                                  ? `bg-indigo-50 border-indigo-100 text-indigo-400 hover:bg-indigo-100`
                                  : `bg-white border-slate-100 text-slate-300 hover:border-slate-300`
                            }`}
                          >
                            {step.label}
                          </button>

                          {/* Dotted Connector */}
                          {index !== statusMap.length - 1 && (
                            <div className="flex gap-1 px-1">
                                <div className={`w-1 h-1 rounded-full ${isPast ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                                <div className={`w-1 h-1 rounded-full ${isPast ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComplaints;