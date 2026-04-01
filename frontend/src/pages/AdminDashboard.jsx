import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import { issueApi } from "../api/issueApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    received: 0,
    in_review: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect route
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      received: data.filter(i => i.status === "received").length,
      in_review: data.filter(i => i.status === "in_review").length,
      in_progress: data.filter(i => i.status === "in_progress").length,
      resolved: data.filter(i => i.status === "resolved").length,
      closed: data.filter(i => i.status === "closed").length,
    });
  };

  const fetchComplaints = async () => {
    try {
const res = await adminApi.getAllComplaints();
const issues = res.data.data || res.data || [];

      setComplaints(issues);
      calculateStats(issues);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {

      // 🔥 status update still uses issue route (correct)
      await issueApi.updateIssueStatus(id, status);

      const updated = complaints.map((c) =>
        c._id === id ? { ...c, status } : c
      );

      setComplaints(updated);
      calculateStats(updated);

    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "received":
        return "bg-slate-200 text-slate-800";
      case "in_review":
        return "bg-amber-100 text-amber-600";
      case "in_progress":
        return "bg-blue-100 text-blue-600";
      case "resolved":
        return "bg-emerald-100 text-emerald-600";
      case "closed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const cards = [
    { title: "Total Complaints", value: stats.total, color: "text-indigo-600" },
    { title: "Received", value: stats.received, color: "text-slate-800" },
    { title: "In Review", value: stats.in_review, color: "text-amber-500" },
    { title: "In Progress", value: stats.in_progress, color: "text-blue-500" },
    { title: "Resolved", value: stats.resolved, color: "text-emerald-500" },
    { title: "Closed", value: stats.closed, color: "text-red-500" },
  ];

  return (
    <div className="w-full flex justify-center py-6 px-4">

      <div className="w-full max-w-6xl">

        {/* Header */}
        <div className="mb-6 ml-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
            Monitor and manage all complaints
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] bg-white shadow px-5 py-4 hover:shadow-lg transition"
            >
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                {card.title}
              </div>
              <div className={`mt-2 text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="mt-10 bg-white rounded-2xl shadow overflow-hidden">

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <table className="w-full text-left">

              <thead className="bg-slate-50">
                <tr className="text-xs uppercase text-slate-600">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Update</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-slate-50">

                    <td className="px-6 py-4">{item.title}</td>

                    <td className="px-6 py-4">{item.address}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(item.status)}`}
                      >
                        {item.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="received">Received</option>
                        <option value="in_review">In Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;