import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import { ArrowLeft } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const res = await Api.get("/orders/order");
      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] px-4 sm:px-6 md:px-14 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
          My Orders
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white border border-gray-300 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg shadow-sm hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm sm:text-base">
            You haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-base sm:text-lg">#{order.order_id}</p>
                <p className="text-gray-600">
                  Total:{" "}
                  <span className="font-semibold">₹{order.total_price}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto">
                <span
  className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${
                    order.status === "delivered"
  ? "bg-green-100 text-green-700"
  : order.status === "pending"
  ? "bg-yellow-100 text-yellow-700"
  : order.status === "cancelled"
  ? "bg-red-100 text-red-600"
  : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
                <button
                  onClick={() => navigate(`/user/orders/${order.order_id}`)}
                  className="text-blue-600 text-xs sm:text-sm font-medium hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
