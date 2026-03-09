import { useEffect, useState } from "react";
import Api from "../Api";
import { Link } from "react-router-dom";
import CreateProductModal from "../components/modals/CreateProductModal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const placeholder = "https://placehold.co/400x300?text=No+Image";
  const fetchProducts = async () => {
    if (!category) {
      const res = await Api.get("/admin/products");
      setProducts(res.data.products);
    } else {
      const res = await Api.get(`/filter/products/${category}`);
      setProducts(res.data.products);
    }
    setCurrentPage(1);
  };
  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = async () => {
    if (!search) {
      fetchProducts();
      return;
    }
    const res = await Api.get(`/product/search?search=${search}`);
    setProducts(res.data.results);
    setCurrentPage(1);
  };
  const handleFilter = (cat) => {
    setCategory(cat);
  };

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            Products
          </h2>
          <button
            onClick={() => setCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg shadow-sm"
          >
            Create Product
          </button>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center bg-white p-4 rounded-xl shadow-sm">
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 w-full sm:w-64 rounded-lg border bg-white p-4 shadow-sm sticky  z-10 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 text-sm sm:text-base rounded-lg"
          >
            Search
          </button>
          <select
            value={category}
            onChange={(e) => handleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => {
            const image = product.p_image
              ? `data:image/*;base64,${product.p_image}`
              : placeholder;
            return (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group">
                  <div className="h-44 sm:h-48 md:h-52 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={image}
                      alt={product.p_name}
                      onError={(e) => (e.target.src = placeholder)}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {product.p_name}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {product.p_category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {product.p_description}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        {product.p_discount > 0 ? (
                          <>
                            <p className="text-sm text-gray-400 line-through">
                              ₹{product.p_price}
                            </p>
                            <p className="font-semibold text-blue-600">
                              ₹{product.price_after_discount}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold text-blue-600">
                            ₹{product.p_price}
                          </p>
                        )}
                      </div>
                      {product.p_discount > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                          {product.p_discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
      {createModal && (
        <CreateProductModal
          close={() => setCreateModal(false)}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminProducts;
