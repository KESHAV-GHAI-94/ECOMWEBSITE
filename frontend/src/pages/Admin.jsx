import { useState, useEffect } from "react";
import Api from "../Api";
import OrdersOverview from "../components/Admin/Dashboard/OrdersOverview";
import Stats from "../components/Admin/Dashboard/Stats";
import OrdersTable from "../components/Admin/Dashboard/OrdersTable";
import TopProducts from "../components/Admin/Dashboard/TopProducts";
const Admin = () => {
  const [stats, setStats] = useState({});
const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await Api.get("/admin/dashboard");
        const ordersRes = await Api.get("/admin/orders");
        const topProductsRes = await Api.get("/admin/top-products");
        setStats(dashboardRes.data.dashboard);
        setOrders(ordersRes.data.orders);
        setTopProducts(topProductsRes.data.top_products);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="px-4 sm:px-6 md:px-10 pt-4 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
          Admin Dashboard
        </h2>
      </div>
      <Stats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
      <OrdersOverview orders={orders} />
        <OrdersTable orders={orders} />
      </div>
      <div className="mt-3">
        <TopProducts products={topProducts} />
      </div>
    </div>
  );
};

export default Admin;
