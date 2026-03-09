import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmModal from "../components/modals/ConfirmModal";
import Api from "../Api";
import { toast } from "react-toastify";

const Orderdetailedpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [modal, setModal] = useState(null);
  const cancelOrder = async () => {
    try {
      await Api.post(`/orders/order-cancel/${order.order_id}`);
      setOrder({ ...order, status: "Cancelled" });
      setModal(null);
      toast.success("order cancelled");
      navigate(-1);
    } catch (err) {
        toast.error(err)
      console.log(err);
    }
  };
  useEffect(() => {
    const getOrder = async () => {
      const res = await Api.get(`/orders/order/${id}`);
      console.log(res.data);
      setOrder(res.data);
    };
    getOrder();
  }, [id]);

  if (!order) return <p className="p-10 text-center">Loading...</p>;
  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 bg-gray-100 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
  Order Details
</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-gray-300 hover:bg-gray-100 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg shadow-sm flex items-center gap-2"
        >
          Back
        </button>
      </div>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-4 mb-6 gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
  Order #{order.order_id}
</h2>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <h3 className="font-semibold text-gray-700 mb-2">Order Info</h3>
            <p className="flex items-center gap-2 mb-1">
              <b>Status:</b>
              <span
  className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium
    ${
      order.status === "Delivered"
        ? "bg-green-100 text-green-700"
        : order.status === "Pending"
        ? "bg-yellow-100 text-yellow-700"
        : order.status === "Cancelled"
        ? "bg-red-100 text-red-600"
        : "bg-gray-100 text-gray-700"
    }
  `}
>
  {order.status}
</span>
            </p>
            <p>
              <b>Total Price:</b> ₹{order.total_price}
            </p>
          </div>
          {order.status !== "Cancelled" && (
  <div className="text-gray-400 gap-5 text-end">
    Having issues ?
    <button
      onClick={() => setModal("Cancel")}
      className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Cancel Order
    </button>
  </div>
)}
        </div>
        <h3 className="font-semibold text-lg sm:text-xl mb-4">
  Ordered Products
</h3>
        <div className="space-y-4">
          {order.products?.map((product) => (
            <div
              key={product.product_id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-200 rounded-lg p-4 bg-gray-50 gap-4 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.product_name}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    {product.product_name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Category: {product.category}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Discount: {product.discount}%
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right text-sm sm:text-base font-medium">
                <p>Price: ₹{product.original_price}</p>
                <p>Qty: {product.quantity}</p>
                <p className="font-semibold">
                  ₹{product.price_after_discount * product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between sm:justify-end items-center mt-8 border-t border-gray-200 pt-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Total: ₹{order.total_price}
          </h2>
        </div>
      </div>
      {modal === "Cancel" && (
        <ConfirmModal
          title="Cancel Order"
          message={`Are you sure you want to cancel Order #${order.order_id}?`}
          confirmText="Cancel Order"
          confirmColor="bg-red-600"
          onConfirm={cancelOrder}
          close={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Orderdetailedpage;
