import { useCallback, useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { adminApi } from "../api/adminApi";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, users: 0 });
    const [complaints, setComplaints] = useState([]);
    const barRef = useRef(null);

    const getLastMonths = (count = 7) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        return Array.from({ length: count }, (_, idx) => {
            const date = new Date(now.getFullYear(), now.getMonth() - count + 1 + idx, 1);
            return { label: monthNames[date.getMonth()], month: date.getMonth(), year: date.getFullYear() };
        });
    };

    const fetchComplaints = useCallback(async () => {
        try {
            // 🔥 Fetch both complaints and users to get real counts
            const [complaintsRes, usersRes] = await Promise.all([
                adminApi.getAllComplaints(),
                adminApi.getAllUsers()
            ]);

            const complaints = complaintsRes.data || [];
            const users = usersRes.data || [];

            setComplaints(complaints);
            setStats({
                total: complaints.length,
                pending: complaints.filter(c => ["received", "in_review"].includes(c.status)).length,
                inProgress: complaints.filter(c => c.status === "in_progress").length,
                resolved: complaints.filter(c => c.status === "resolved").length,
                users: users.length // ✅ Now using real database count
            });
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    useEffect(() => {
        const refresh = () => fetchComplaints();
        window.addEventListener("focus", refresh);
        window.addEventListener("complaintsUpdated", refresh);
        return () => {
            window.removeEventListener("focus", refresh);
            window.removeEventListener("complaintsUpdated", refresh);
        };
    }, [fetchComplaints]);

    useEffect(() => {
        if (!barRef.current) return;

        const months = getLastMonths(7);
        const monthlyData = months.map(({ month, year }) =>
            complaints.filter(c => {
                const created = new Date(c.createdAt);
                return created.getMonth() === month && created.getFullYear() === year;
            }).length
        );

        const chart = new Chart(barRef.current, {
            type: "bar",
            data: {
                labels: months.map(m => m.label),
                datasets: [{
                    label: "Complaints",
                    data: monthlyData,
                    backgroundColor: "rgba(99,102,241,0.85)",
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "rgba(0,0,0,0.05)" } }
                }
            }
        });
        return () => chart.destroy();
    }, [complaints]);

    const cards = [
        { label: "Total", val: stats.total, color: "#6366f1", bg: "#eef2ff" },
        { label: "Pending", val: stats.pending, color: "#f59e0b", bg: "#fffbeb" },
        { label: "Resolved", val: stats.resolved, color: "#10b981", bg: "#ecfdf5" },
        { label: "Active Users", val: stats.users, color: "#8b5cf6", bg: "#f5f3ff" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cards.map((c, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                        <div style={{ background: c.bg, color: c.color }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold text-lg font-mono">
                            {c.label === "Active Users" ? "👤" : "#"}
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{c.val}</div>
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{c.label}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Monthly Complaint Volume</h3>
                <div className="h-64"><canvas ref={barRef} /></div>
            </div>
        </div>
    );
};

export default AdminDashboard;