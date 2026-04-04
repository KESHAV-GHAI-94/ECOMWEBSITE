import { useEffect, useState } from "react";
import Api from "../Api";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/modals/ConfirmModal";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const res = await Api.get("/cart/view-cart");
      setCart(res.data);
    } catch (err) {
      setCart(null);
    }
  };
  const removeProduct = async (product_id) => {
    try {
      await Api.post("/cart/remove-cart", { product_id });
      toast.success("Product removed");
      getCart();
    } catch (err) {
      console.log(err);
    }
  };
  const updateQuantity = async (product_id, quantity) => {
    if (quantity < 1) return;
    try {
      await Api.post("/cart/updatequantity-product", {
        product_id,
        quantity,
      });
      getCart();
    } catch (err) {
      console.log(err);
    }
  };

  const checkoutorder = async () => {
    try {
      const res = await Api.post("/orders/checkout");
      toast.success("Order placed successfully ");
      setModal(null);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  if (!cart) {
    return (
      <div className="flex flex-col justify-center  items-center min-h-[calc(100vh-64px)] gap-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Your cart is empty 🛒
        </h2>
        <p className="text-gray-500">
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">
        Shopping Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
        <div className="lg:col-span-2 space-y-6 overflow-y-auto">
          {cart.cart.map((item) => (
            <div
              key={item.product_id}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:shadow-md transition"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                  <span className="text-xs text-gray-400 hidden">No Image</span>
                </div>
                <div>
                  <h2 className="font-semibold text-sm sm:text-base md:text-lg">
                    {item.product_name}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    MRP:
                    <span className="line-through ml-1">₹{item.price}</span>
                    {item.discount > 0 && (
                      <span className="text-green-600 text-xs font-semibold bg-green-50 px-0 md:px-2 py-0.5 rounded">
                        {item.discount}% OFF
                      </span>
                    )}
                  </p>
                  <p className="text-blue-600 font-semibold text-sm sm:text-base">
                    ₹{item.price_after_discount} each
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                      className="p-1 sm:p-2 border rounded hover:bg-gray-100 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="p-1 sm:p-2 border rounded hover:bg-gray-100 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto">
                <p className="text-lg font-semibold">
                  ₹{item.total_after_discount}
                </p>
                <button
                  onClick={() => removeProduct(item.product_id)}
                  className="text-red-500 flex items-center gap-1 text-xs sm:text-sm hover:underline"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">
            Order Summary
          </h2>
          <div className="flex justify-between mb-3 text-gray-600">
            <span>Total Items</span>
            <span>{cart.total_items}</span>
          </div>
          <div className="flex justify-between mb-3 text-gray-600">
            <span>Total Price</span>
            <span>₹{cart.cart_total_price}</span>
          </div>
          <div className="flex justify-between mb-4 text-green-600 font-semibold">
            <span>You Save</span>
            <span>
              ₹
              {(cart.cart_total_price - cart.cart_total_after_discount).toFixed(
                2,
              )}
            </span>
          </div>
          <hr className="mb-4 text-gray-300" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>₹{cart.cart_total_after_discount}</span>
          </div>
          <button
            onClick={() => setModal("Checkout")}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      {modal === "Checkout" && (
        <ConfirmModal
          title="Checkout"
          message={`Are you sure you want to pay this amount ₹${cart.cart_total_after_discount}?`}
          confirmText="Pay"
          confirmColor="bg-blue-600"
          onConfirm={() => {
            checkoutorder();
          }}
          close={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Cart;
