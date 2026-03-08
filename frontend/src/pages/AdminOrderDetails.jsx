import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../Api";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);

  const updateStatus = async () => {
    try {
      await Api.post(`/admin/update-order/status`, null, {
        params: {
          order_id: order.order_id,
          status: status,
        },
      });

      setOrder({ ...order, status });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getOrder = async () => {
      const res = await Api.get(`/admin/order/${id}`);
      setOrder(res.data.order);
      setStatus(res.data.order.status);
    };
    getOrder();
  }, [id]);

  if (!order) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 bg-gray-100 min-h-screen">
      <div className="flex flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
          Orders Detailed Page
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="self-start sm:self-auto bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 text-sm sm:text-base rounded-lg shadow-sm"
        >
          Back
        </button>
      </div>
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-4 mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">
            Order #{order.order_id}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={updateStatus}
              disabled={status === order.status}
              className={`px-4 py-2 text-sm rounded-lg border shadow-sm
              ${
                status === order.status
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              Update
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Customer Info</h3>
            <p>
              <b>Name:</b> {order.user_name}
            </p>
            <p>
              <b>Email:</b> {order.user_email}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Order Info</h3>
            <p className="flex items-center gap-2 mb-1">
              <b>Status:</b>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 border">
                {order.status}
              </span>
            </p>
            <p>
              <b>Total Price:</b> ₹{order.total_price}
            </p>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-4">Products</h3>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div
              key={product.product_id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-lg p-4 bg-gray-50 gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`data:image/jpeg;base64,${product.product_image}`}
                  alt={product.product_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    {product.product_name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Category: {product.p_category}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Discount: {product.p_discount}%
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-sm sm:text-base">
                <p>Price: ₹{product.price}</p>
                <p>Qty: {product.quantity}</p>
                <p className="font-semibold">
                  ₹{product.price * product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8 border-t border-gray-300 pt-4">
          <h2 className="text-lg sm:text-xl font-bold">
            Total: ₹{order.total_price}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
