import { useCallback, useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { adminApi } from "../api/adminApi";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, users: 0 });
<<<<<<< HEAD
    const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0)); // Array for Jan-Dec
=======
    const [complaints, setComplaints] = useState([]);
>>>>>>> ee26d023b945dc67c69df96f3e0363fe02c2f2a1
    const barRef = useRef(null);
    const chartInstance = useRef(null);

<<<<<<< HEAD
    useEffect(() => {
        const load = async () => {
            try {
                const [complaintsRes, usersRes] = await Promise.all([
                    adminApi.getAllComplaints(),
                    adminApi.getAllUsers()
                ]);
=======
    const getLastMonths = (count = 7) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        return Array.from({ length: count }, (_, idx) => {
            const date = new Date(now.getFullYear(), now.getMonth() - count + 1 + idx, 1);
            return { label: monthNames[date.getMonth()], month: date.getMonth(), year: date.getFullYear() };
        });
    };
>>>>>>> ee26d023b945dc67c69df96f3e0363fe02c2f2a1

    const fetchComplaints = useCallback(async () => {
        try {
            // 🔥 Fetch both complaints and users to get real counts
            const [complaintsRes, usersRes] = await Promise.all([
                adminApi.getAllComplaints(),
                adminApi.getAllUsers()
            ]);

<<<<<<< HEAD
                // --- Calculate Chart Data (Live) ---
                const counts = new Array(12).fill(0);
                complaints.forEach(c => {
                    const month = new Date(c.createdAt).getMonth(); // 0 = Jan, 1 = Feb...
                    counts[month] += 1;
                });
                setMonthlyData(counts);

                // --- Set Top Stats ---
                setStats({
                    total: complaints.length,
                    pending: complaints.filter(c => ["received", "in_review"].includes(c.status)).length,
                    inProgress: complaints.filter(c => c.status === "in_progress").length,
                    resolved: complaints.filter(c => c.status === "resolved").length,
                    users: users.length
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        load();
=======
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
>>>>>>> ee26d023b945dc67c69df96f3e0363fe02c2f2a1
    }, []);

    // Effect to handle Chart lifecycle
    useEffect(() => {
<<<<<<< HEAD
        if (barRef.current) {
            // Destroy existing chart if it exists to prevent memory leaks/glitches
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = barRef.current.getContext("2d");
            chartInstance.current = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [{
                        label: "Complaints",
                        data: monthlyData, // ✅ Now using state variable
                        backgroundColor: "rgba(99, 102, 241, 0.85)",
                        borderRadius: 6,
                        hoverBackgroundColor: "#4f46e5"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
                        y: {
                            beginAtZero: true,
                            grid: { color: "rgba(0,0,0,0.05)" },
                            ticks: { stepSize: 1 }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [monthlyData]); // Re-run when monthlyData changes
=======
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
>>>>>>> ee26d023b945dc67c69df96f3e0363fe02c2f2a1

    const cards = [
        { label: "Total", val: stats.total, color: "#6366f1", bg: "#eef2ff", icon: "#" },
        { label: "Pending", val: stats.pending, color: "#f59e0b", bg: "#fffbeb", icon: "⏳" },
        { label: "Resolved", val: stats.resolved, color: "#10b981", bg: "#ecfdf5", icon: "✅" },
        { label: "Active Users", val: stats.users, color: "#8b5cf6", bg: "#f5f3ff", icon: "👤" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cards.map((c, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div style={{ background: c.bg, color: c.color }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold text-lg">
                            {c.icon}
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{c.val}</div>
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{c.label}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Monthly Complaint Volume</h3>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">2026 Analytics</span>
                </div>
                <div className="h-64">
                    <canvas ref={barRef} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;