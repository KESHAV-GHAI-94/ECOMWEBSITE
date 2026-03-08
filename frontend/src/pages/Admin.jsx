import { useState, useEffect } from "react";
import Api from "../Api";

import Stats from "../components/Admin/Dashboard/Stats";
import OrdersTable from "../components/Admin/Dashboard/OrdersTable";
const Admin = () => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await Api.get("/admin/dashboard");
        const ordersRes = await Api.get("/admin/orders");
        setStats(dashboardRes.data.dashboard);
        setOrders(ordersRes.data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
      Admin Dashboard
    </h2>
  </div>
      <Stats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default Admin;