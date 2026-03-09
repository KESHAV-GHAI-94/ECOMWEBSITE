import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api";
import { ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

const ShopProductDetailpage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const getProduct = async () => {
    try {
      const res = await Api.get(`/view-product/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      console.log(err);
    }
  };

const AddtoProduct = async () =>{
    try{
    const res = await Api.post(`/cart/add-to-product`,{
        product_id: product.id,
        quantity: quantity
    });
    console.log(res.data)
    toast.success("Product add to cart successfully!");
    }
    catch (err){
        console.error(err);
    }
}

  useEffect(() => {
    getProduct();
  }, [id]);
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-full px-4 md:px-16 py-6 md:py-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">
          {product.p_name}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-white border px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 text-sm"
        >
          Back
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <div className="relative bg-gray-50 rounded-xl p-4 flex items-center justify-center h-[250px] md:h-[380px]">
            {product.p_discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {product.p_discount}% OFF
              </span>
            )}
            <img
              src={`data:image/jpeg;base64,${product.p_image}`}
              alt={product.p_name}
              className="max-h-[200px] md:max-h-[320px] object-contain"
            />
          </div>
          <div className="grid grid-cols-3 text-center text-xs md:text-sm text-gray-600 border rounded-lg p-3 bg-gray-50">
            <p>Warranty</p>
            <p>Replacement</p>
            <p>Delivery</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {product.p_name}
          </h2>
          <p className="text-gray-500 text-sm">
            Category: <span className="font-medium">{product.p_category}</span>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl md:text-4xl font-bold text-blue-600">
              ₹{product.price_after_discount}
            </span>
            {product.p_discount > 0 && (
              <>
                <span className="line-through text-gray-400">
                  ₹{product.p_price}
                </span>
                <span className="text-green-600 text-xs md:text-sm bg-green-50 px-2 py-1 rounded">
                  Save {product.p_discount}%
                </span>
              </>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.p_description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-base font-medium">Quantity</span>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-20 border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-sm"
            />
          </div>
          {user &&(
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={()=>AddtoProduct()} className="bg-blue-600 text-white sm:px-5 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="bg-yellow-400  text-black sm:px-7 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold">
              Buy Now
            </button>
          </div>
          )}
          {!user &&(
            <p className="text-sm md:text-lg text-semibold text-blue-600 mt-5">* Login first to add this product in cart</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetailpage;
