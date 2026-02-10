import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_review: 0,
    resolved: 0,
  });

useEffect(() => {
    setStats({
    total: 12,
    pending: 3,
    in_review: 5,
    resolved: 4,
    });
 }, []);

  return (
    <div className="w-full flex justify-center py-6 px-4">
    <div className="w-full max-w-5xl">

        {/*------Header Section----*/}
        <div className="mb-6 ml-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
            Quick view of your submitted complaints
        </p>
        </div>

        {/*------Stats Grid---*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/*------Card*------*/}
        <div className="rounded-[1.5rem] border border-white bg-white/70 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-xl px-5 py-4 transition-all hover:shadow-lg">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-900">
            Total Reports
            </div>
            <div className="mt-2 text-2xl font-bold text-indigo-600">
            {stats.total}
            </div>
        </div>

        {/*------Received Card---------*/}
        <div className="rounded-[1.5rem] border border-white bg-white/70 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-xl px-5 py-4 transition-all hover:shadow-lg">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-900">
            Received
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-800">
            {stats.pending}
            </div>
        </div>

          {/* In Review Card */}
        <div className="rounded-[1.5rem] border border-white bg-white/70 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-xl px-5 py-4 transition-all hover:shadow-lg">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-900">
            In Review
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-500">
            {stats.in_review}
            </div>
        </div>

          {/* Resolved Card */}
        <div className="rounded-[1.5rem] border border-white bg-white/70 shadow-[0_10px_30px_rgba(79,70,229,0.06)] backdrop-blur-xl px-5 py-4 transition-all hover:shadow-lg">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-slate-900">
              Resolved
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-500">
              {stats.resolved}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;