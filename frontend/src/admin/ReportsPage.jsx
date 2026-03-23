import { useEffect, useState, useRef } from "react";
import { adminApi } from "../api/adminApi";
import { Chart } from "chart.js/auto";

const ReportsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart Refs
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const polarChartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await adminApi.getAllComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.error("Error fetching report data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaints.length === 0) return;

    // --- 1. Line Chart: Issues Over Time ---
    const dateMap = {};
    complaints.forEach(c => {
      const date = new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    const lineChart = new Chart(lineChartRef.current, {
      type: 'line',
      data: {
        labels: Object.keys(dateMap),
        datasets: [{
          label: 'Submissions',
          data: Object.values(dateMap),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // --- 2. Pie Chart: Status Distribution ---
    const statusCounts = complaints.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    const pieChart = new Chart(pieChartRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCounts).map(s => s.replace('_', ' ').toUpperCase()),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ['#94a3b8', '#f59e0b', '#6366f1', '#10b981'],
          borderWidth: 0
        }]
      },
      options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
    });

    // --- 3. Polar Area: Issues by Region ---
    const regionMap = complaints.reduce((acc, c) => {
      const region = c.address?.split(',').pop().trim() || "Unknown";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});

    const polarChart = new Chart(polarChartRef.current, {
      type: 'polarArea',
      data: {
        labels: Object.keys(regionMap),
        datasets: [{
          data: Object.values(regionMap),
          backgroundColor: ['rgba(99, 102, 241, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    return () => {
      lineChart.destroy();
      pieChart.destroy();
      polarChart.destroy();
    };
  }, [complaints]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Analytical Insights</h1>
          <p className="text-slate-400 font-medium italic">Data-driven overview of community performance</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black uppercase text-indigo-600 tracking-widest">
           Live Data Sync
        </div>
      </div>

      {/* --- Charts Row 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Submission Velocity (By Date)</h3>
          <div className="h-64"><canvas ref={lineChartRef} /></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Status Breakdown</h3>
          <div className="h-64"><canvas ref={pieChartRef} /></div>
        </div>
      </div>

      {/* --- Charts Row 2 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Regional Hotspots</h3>
          <div className="h-80"><canvas ref={polarChartRef} /></div>
        </div>

        {/* Statistics Summary Table */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 relative z-10">Metric Summary</h3>
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <span className="text-slate-400 text-sm font-medium">Resolution Efficiency</span>
               <span className="text-2xl font-black text-indigo-400">
                  {complaints.length > 0 ? Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100) : 0}%
               </span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
               <span className="text-slate-400 text-sm font-medium">Active Pipelines</span>
               <span className="text-2xl font-black">{complaints.filter(c => c.status !== 'resolved').length}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-slate-400 text-sm font-medium">Critical (Unaddressed)</span>
               <span className="text-2xl font-black text-rose-500">{complaints.filter(c => c.status === 'received').length}</span>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-[80px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;