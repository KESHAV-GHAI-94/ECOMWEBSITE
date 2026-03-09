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
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex  items-center gap-2 bg-white px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="border rounded-xl p-5 shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Order ID
                </p>
                <p className="font-semibold text-lg">
                  #{order.order_id}
                </p>
                <p className="text-gray-600">
                  Total: <span className="font-semibold">₹{order.total_price}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
                <button
                  onClick={() => navigate(`/user/orders/${order.order_id}`)}
                  className="text-blue-600 text-sm font-medium hover:underline"
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