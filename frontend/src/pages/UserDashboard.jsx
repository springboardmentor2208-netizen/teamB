import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { issueApi } from "../api/issueApi";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    received: 0,
    in_review: 0,
    resolved: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await issueApi.getMyIssues();

        const issues = data || [];
        setComplaints(issues);

        setStats({
          total: issues.length,
          received: issues.filter(i => i.status === "received").length,
          in_review: issues.filter(i => i.status === "in_review").length,
          resolved: issues.filter(i => i.status === "resolved").length,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "received":
        return "bg-slate-200 text-slate-800";
      case "in_review":
        return "bg-amber-100 text-amber-600";
      case "resolved":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const cards = [
    { title: "Total Reports", value: stats.total, color: "text-indigo-600" },
    { title: "Received", value: stats.received, color: "text-slate-800" },
    { title: "In Review", value: stats.in_review, color: "text-amber-500" },
    { title: "Resolved", value: stats.resolved, color: "text-emerald-500" },
  ];

  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div className="w-full max-w-6xl">

        {/* Header */}
        <div className="mb-6 ml-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
              Quick view of your submitted complaints
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/report-issue")}
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Report Issue
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          ) : complaints.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No complaints submitted yet.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase text-slate-600">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Status</th>
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status.replace("_", " ").toUpperCase()}
                      </span>
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

export default UserDashboard;