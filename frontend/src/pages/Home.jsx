import { useEffect, useState } from "react";
import Api from "../Api";
import { ShoppingCart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { toast } from "react-toastify"
const Home = () => {
  const [products, setProducts] = useState([]);
  const { user} = useContext(AuthContext);
  const getProducts = async () => {
    try {
      const res = await Api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };
  const AddtoProduct = async (productId) =>{
    try{
    const res = await Api.post(`/cart/add-to-product`,{
        product_id: productId,
        quantity: 1
    });
    console.log(res.data)
    toast.success("Product add to cart successfully!");
    } catch (err) {
    console.error(err);
    toast.error("Failed to add product");
  }
}
  useEffect(() => {
    getProducts();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100">
      <section className="bg-blue-600 text-white py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Shop Smarter Everyday
          </h1>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
            Discover amazing deals on electronics, fashion, shoes and
            accessories.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-yellow-400 text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-yellow-500 transition"
          >
            Shop Now
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
          className="w-full sm:w-[80%] md:w-[420px] mt-8 md:mt-0 rounded-lg shadow-lg"
        />
      </section>
      <section className="py-12 px-6 md:px-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-center">
          Shop By Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Electronics", "Fashion", "Shoes", "Accessories"].map((cat) => (
            <div
              key={cat}
              className="bg-white shadow-md p-6 text-center rounded-lg hover:shadow-xl cursor-pointer"
            >
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">{cat}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className="py-12 px-6 md:px-16 bg-white">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-10 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => navigate("/shop")}
              className="border border-gray-300 cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
            >
              <div className="relative">
                {product.p_discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.p_discount}% OFF
                  </span>
                )}
                <img
                  src={`data:image/jpeg;base64,${product.p_image}`}
                  alt={product.p_name}
                  className="h-48 w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm sm:text-base mb-1">{product.p_name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm">{product.p_category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-blue-600 font-bold">
                    ₹{product.price_after_discount}
                  </span>
                  {product.p_discount > 0 && (
                    <span className="line-through text-gray-400 text-sm">
                      ₹{product.p_price}
                    </span>
                  )}
                </div>
                {user &&(
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    AddtoProduct(product.id);
                  }}
                  className="mt-3 sm:mt-4 w-full bg-blue-600 text-white py-2 sm:py-2.5 text-sm sm:text-base rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-yellow-400 py-12 px-6 md:px-16 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          Get 20% Off On Your First Order
        </h2>
        <Link to="/shop">
          <button className="bg-black text-white cursor-pointer px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-gray-800 transition">
            Start Shopping
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
