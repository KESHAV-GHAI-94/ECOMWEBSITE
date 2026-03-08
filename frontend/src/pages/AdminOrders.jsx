import { useEffect, useState } from "react";
import Api from "../Api";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("latest");
  const ordersPerPage = 10;
  const navigate = useNavigate();
  const fetchOrders = async () => {
    try {
      const res = await Api.get("/admin/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const sortedOrders = [...orders].sort((a, b) => {
    if (filter === "high_price") return b.total_price - a.total_price;
    if (filter === "low_price") return a.total_price - b.total_price;
    if (filter === "oldest") return a.order_id - b.order_id;
    return b.order_id - a.order_id;
  });
  const visibleOrders = sortedOrders.slice(
    currentPage * ordersPerPage,
    currentPage * ordersPerPage + ordersPerPage,
  );
  const statusColor = (status) => {
    if (status === "processed") return "text-green-600 bg-green-100";
    if (status === "cancelled") return "text-red-600 bg-red-100";
    return "text-yellow-600 bg-yellow-100";
  };
  return (
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
          Orders
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-purple-500" size={20} />
            <h2 className="font-semibold text-lg md:text-xl text-gray-800">
              Orders
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm"
            >
              <option value="latest">Latest Orders</option>
              <option value="oldest">Oldest Orders</option>
              <option value="high_price">Highest Price</option>
              <option value="low_price">Lowest Price</option>
            </select>
            {orders.length > ordersPerPage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className="flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm bg-gray-50 p-3 rounded">
            No orders found
          </p>
        ) : (
          <div className="space-y-2">
            {visibleOrders.map((order) => (
              <div
                key={order.order_id}
                onClick={() => navigate(`/admin/order/${order.order_id}`)}
                className="flex items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-xl hover:bg-purple-50 transition group cursor-pointer"
              >
                <div>
                  <p className="font-medium text-sm sm:text-base text-gray-800 group-hover:text-purple-600">
                    Order #{order.order_id}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    User {order.user_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-semibold">
                    ₹{order.total_price}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${statusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
