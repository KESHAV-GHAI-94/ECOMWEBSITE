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
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] px-3 sm:px-6 md:px-12 lg:px-16 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 overflow-y-auto">
          {cart.cart.map((item) => (
            <div
              key={item.product_id}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.product_image ? (
                    <img
                      src={`data:image/png;base64,${item.product_image}`}
                      alt={item.product_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-base sm:text-lg">
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
                  <p className="text-blue-600 font-semibold">
                    ₹{item.price_after_discount} each
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="p-1 border rounded hover:bg-gray-100"
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
                  className="text-red-500 flex items-center gap-1 text-sm hover:underline"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl lg:w-1/4 shadow-sm  p-6 h-fit lg:fixed lg:top-38 lg:right-20">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
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
          onConfirm={()=>{
            checkoutorder()
          }}
          close={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Cart;
