import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-[#F8F9FF] via-[#F1F3F9] to-[#F8F9FF] overflow-hidden">

      <Navbar />
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-none">
            <Outlet />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-50/50 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/4 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-rose-50/40 blur-[100px] pointer-events-none" />
    </div>
  );
};

export default MainLayout;