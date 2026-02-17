import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_review: 0,
    resolved: 0,
  });

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Mock stats data
    setStats({
      total: 12,
      pending: 3,
      in_review: 5,
      resolved: 4,
    });

    // Mock complaints data
    setComplaints([
      {
        id: 1,
        title: "Street Light Not Working",
        category: "Electricity",
        status: "Pending",
        date: "2026-02-01",
      },
      {
        id: 2,
        title: "Garbage Not Collected",
        category: "Sanitation",
        status: "In Review",
        date: "2026-02-03",
      },
      {
        id: 3,
        title: "Water Leakage",
        category: "Water Supply",
        status: "Resolved",
        date: "2026-02-05",
      },
    ]);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-slate-200 text-slate-800";
      case "In Review":
        return "bg-amber-100 text-amber-600";
      case "Resolved":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const cards = [
    { title: "Total Reports", value: stats.total, color: "text-indigo-600" },
    { title: "Received", value: stats.pending, color: "text-slate-800" },
    { title: "In Review", value: stats.in_review, color: "text-amber-500" },
    { title: "Resolved", value: stats.resolved, color: "text-emerald-500" },
  ];

  return (
    <div className="w-full flex justify-center py-6 px-4">
      <div className="w-full max-w-6xl">

        {/* -------- Header -------- */}
        <div className="mb-6 ml-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
            Quick view of your submitted complaints
          </p>
        </div>

        {/* -------- Stats Grid -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-[1.5rem] border border-white bg-white/70 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-xl px-5 py-4 transition-all hover:shadow-lg"
            >
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-900">
                {card.title}
              </div>
              <div className={`mt-2 text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* -------- Recent Complaints -------- */}
        <div className="mt-10">
          <div className="mb-4 ml-1">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Complaints
            </h2>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest">
              Overview of latest submitted issues
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white bg-white/70 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-xl overflow-hidden">

            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="text-[11px] uppercase tracking-widest text-slate-600">
                  <th className="px-6 py-4">Issue Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  {/* <th className="px-6 py-4 text-center">Action</th> */}
                </tr>
              </thead>

              <tbody>
                {complaints.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {item.date}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {/* <button className="px-4 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition">
                        View
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;