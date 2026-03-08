import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "../../Api";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await Api.post("/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-56 h-full bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">
      <div className="px-5 py-6 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
      </div>
      <div className="flex-1 px-3 py-4 space-y-3">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${
            location.pathname === "/dashboard"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link
          to="/products"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${
            location.pathname === "/products"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Package size={18} />
          Products
        </Link>
        <Link
          to="/orders"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${
            location.pathname === "/orders"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <ShoppingCart size={18} />
          Orders
        </Link>
      </div>
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {profile?.name || "Admin"}
            </span>
            <span className="text-xs text-gray-400">
              {profile?.email || "admin@email.com"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
