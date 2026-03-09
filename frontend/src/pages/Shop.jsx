import { useEffect, useState } from "react";
import Api from "../Api";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import {toast} from "react-toastify"
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");
  const {user}= useContext(AuthContext)
  const productsPerPage = 8;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      const res = await Api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  const searchProducts = async () => {
    try {
      const res = await Api.get(`/product/search?search=${search}`);
      setProducts(res.data.results);
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
  const filterCategory = async (category) => {
    try {
      const res = await Api.get(`/filter/products/${category}`);
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  const delay = setTimeout(() => {
    if (search.trim() === "") {
      getProducts();
    } else {
      searchProducts();
    }
  }, 500);
  return () => clearTimeout(delay);
}, [search]);

  return (
    <div className="bg-gray-100 min-h-screen px-4 sm:px-6 md:px-12 lg:px-16 py-5">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 text-gray-800">Products</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 w-full md:w-[350px] lg:w-[400px] shadow-sm">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full text-sm sm:text-base"
          />
          <Search size={20} className="text-gray-500" />
        </div>
        <div>
          <select
            value={category}
            onChange={(e) => {
              const selected = e.target.value;
              setCategory(selected);
              if (selected === "") {
                getProducts();
              } else {
                filterCategory(selected);
              }
            }}
            className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="books">Books</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition cursor-pointer group"
            onClick={() => navigate(`/productdetail/${product.id}`)}
          >
            <div className="relative overflow-hidden rounded-t-xl">
              {product.p_discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                  {product.p_discount}% OFF
                </span>
              )}
              <img
                src={`data:image/jpeg;base64,${product.p_image}`}
                alt={product.p_name}
                className="h-44 sm:h-48 md:h-52 border-b border-gray-200 w-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-1">
                {product.p_name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">{product.p_category}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-blue-600 text-base sm:text-lg font-bold">
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
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-3 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition
              ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
