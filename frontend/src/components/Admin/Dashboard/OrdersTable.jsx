import { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

const OrdersSection = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 3;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const visibleOrders = orders.slice(
    currentPage * ordersPerPage,
    currentPage * ordersPerPage + ordersPerPage,
  );
  const statusColor = (status) => {
    if (status === "processed") return "text-green-600 bg-green-100";
    if (status === "cancelled") return "text-red-600 bg-red-100";
    return "text-yellow-600 bg-yellow-100";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-purple-500" size={20} />
          <h2 className="font-semibold text-sm md:text-lg text-gray-800">
            Recent Orders
          </h2>
        </div>
        {orders.length > ordersPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="flex items-center justify-center h-7 w-7 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className="flex items-center justify-center h-7 w-7 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm bg-gray-50 p-2 rounded">
          No orders found
        </p>
      ) : (
        <div>
          {visibleOrders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center justify-between bg-gray-50 p-3 mb-1 rounded-xl hover:bg-purple-50 transition group"
            >
              <div>
                <p className="font-medium text-sm text-gray-800 group-hover:text-purple-600">
                  Order #{order.order_id}
                </p>
                <p className="text-xs text-gray-400">User: {order.user_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{order.total_price}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${statusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
