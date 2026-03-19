import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

const AdminDashboard = () => {
  // Added a state to hold the raw data for the report
  const [dataList, setDataList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
    resolutionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminApi.getAllComplaints();
        setDataList(data); // Store the raw data here

        const total = data.length;
        const resolved = data.filter(c => c.status === "resolved").length;
        const inProgress = data.filter(c => c.status === "in_progress" || c.status === "in_review").length;
        const pending = data.filter(c => c.status === "received").length;

        setStats({
          total,
          resolved,
          inProgress,
          pending,
          resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  // --- NEW: Download Logic ---
  const handleDownload = () => {
    if (dataList.length === 0) return alert("No data available to export.");

    // CSV Headers
    const headers = ["Complaint ID", "Title", "Status", "Created At"];

    // Map data to CSV rows
    const csvRows = dataList.map(c => [
      c._id,
      `"${c.title.replace(/"/g, '""')}"`, // Escape quotes
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    // Create CSV content
    const csvContent = [headers, ...csvRows].map(row => row.join(",")).join("\n");

    // Trigger browser download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `System_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time status of community complaints</p>
      </div>

      {/* --- Main Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-center">

        {/* Total Issues */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Issues</p>
          <h2 className="text-4xl font-black text-slate-900">{stats.total}</h2>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 w-full animate-pulse"></div>
          </div>
        </div>

        {/* Pending / New */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-1">Pending</p>
          <h2 className="text-4xl font-black text-slate-900">{stats.pending}</h2>
          <div className="mt-4 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-1000"
              style={{ width: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-indigo-500 font-bold uppercase text-[10px] tracking-widest mb-1">In Progress</p>
          <h2 className="text-4xl font-black text-slate-900">{stats.inProgress}</h2>
          <div className="mt-4 h-1 w-full bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000"
              style={{ width: stats.total > 0 ? `${(stats.inProgress / stats.total) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest mb-1">Resolved</p>
          <h2 className="text-4xl font-black text-emerald-600">{stats.resolved}</h2>
          <div className="mt-4 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: stats.total > 0 ? `${(stats.resolved / stats.total) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Second Row: Resolution Efficiency --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-indigo-300 font-bold uppercase text-xs tracking-[0.2em] mb-2">Efficiency Rating</p>
            <h3 className="text-5xl font-black mb-2">{stats.resolutionRate}%</h3>
            <p className="text-slate-400 text-sm max-w-[250px]">Overall community issue resolution success rate.</p>
          </div>
          <div className="hidden md:block">
             <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * stats.resolutionRate) / 100}
                        className="text-indigo-500 transition-all duration-1000" />
             </svg>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-center">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">Quick Action</p>
            {/* Added onClick handler here */}
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
                Download Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;