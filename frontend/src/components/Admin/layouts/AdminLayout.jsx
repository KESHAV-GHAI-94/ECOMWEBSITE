import { Outlet,useLocation } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../Sidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "admin";
const title = path.charAt(0).toUpperCase() + path.slice(1);
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <div className="hidden md:block h-screen">
        <AdminSidebar />
      </div>
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            sidebarOpen ? "opacity-20" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full transform bg-white transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <div className="md:hidden p-4 bg-white shadow flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            ☰
          </button>
          <h1 className="ml-4 font-semibold">{title}</h1>
        </div>
        <main className="flex-1 overflow-y-auto px-1 py-0 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;