import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "../../Api";

import {
  LayoutDashboard,
  Package,
  PlusSquare,
  Edit,
  Trash2,
  ShoppingCart,
  RefreshCw,
  LogOut
} from "lucide-react";

const AdminSidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const getProfile = async () => {
    try {
      const res = await Api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await Api.post("/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (

    <div className="w-56 h-full bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">

      {/* HEADER */}

      <div className="px-5 py-6 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-white">
          Admin Panel
        </h1>
      </div>

      {/* MENU */}

      <div className="flex-1 px-3 py-4 space-y-3">

        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${location.pathname === "/dashboard"
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"}
          `}
        >
          <LayoutDashboard size={18}/>
          Dashboard
        </Link>


        <Link
          to="/admin/products"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${location.pathname === "/admin/products"
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"}
          `}
        >
          <Package size={18}/>
          Products
        </Link>
        <Link
          to="/admin/orders"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${location.pathname === "/admin/orders"
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"}
          `}
        >
          <ShoppingCart size={18}/>
          Orders
        </Link>


        <Link
          to="/admin/update-order"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition
          ${location.pathname === "/admin/update-order"
            ? "bg-gray-800 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"}
          `}
        >
          <RefreshCw size={18}/>
          Update Order
        </Link>

      </div>

      {/* FOOTER PROFILE */}

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
          <LogOut size={16}/>
          Logout
        </button>

      </div>

    </div>
  );
};

export default AdminSidebar;