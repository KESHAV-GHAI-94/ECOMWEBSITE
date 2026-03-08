import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Api";
import { toast } from "react-toastify";
import ConfirmModal from "../components/modals/ConfirmModal";
const ProductEdit = () => {
  const [modal, setModal] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    p_name: "",
    p_description: "",
    p_price: "",
    p_discount: "",
    p_category: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const placeholder = "https://placehold.co/400x300?text=No+Image";
  const loadProduct = async () => {
    try {
      const res = await Api.get(`/view-product/${id}`);
      const data = res.data?.product || {};
      setProduct({
        p_name: data.p_name ?? "",
        p_description: data.p_description ?? "",
        p_price: data.p_price ?? "",
        p_discount: data.p_discount ?? "",
        p_category: data.p_category ?? "",
      });
      if (data.p_image) {
        setPreview(`data:image/*;base64,${data.p_image}`);
      } else {
        setPreview(null);
      }
    } catch {
      toast.error("Failed to load product");
    }
  };
  useEffect(() => {
    loadProduct();
  }, []);
  const changeValue = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const changeImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const validate = () => {
    if (!product.p_name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!product.p_description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!product.p_price || product.p_price <= 0) {
      toast.error("Enter a valid price");
      return false;
    }
    if (product.p_discount < 0 || product.p_discount > 100) {
      toast.error("Discount must be between 0 and 100");
      return false;
    }
    if (!product.p_category) {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };
  const updateProduct = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("p_name", product.p_name);
      form.append("p_description", product.p_description);
      form.append("p_price", product.p_price);
      form.append("p_discount", product.p_discount);
      form.append("p_category", product.p_category);
      if (image) {
        form.append("image", image);
      }
      await Api.post("/admin/update-product", form);
      toast.success("Product updated successfully");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch {
      toast.error("Update failed");
    }
  };
  const confirmUpdate = async () => {
    const form = new FormData();
    form.append("id", id);
    form.append("p_name", product.p_name);
    form.append("p_description", product.p_description);
    form.append("p_price", product.p_price);
    form.append("p_discount", product.p_discount);
    form.append("p_category", product.p_category);
    if (image) {
      form.append("image", image);
    }
    try {
      await Api.post("/admin/update-product", form);
      toast.success("Product updated");
      navigate("/admin/products");
    } catch {
      toast.error("Update failed");
    }
  };
  const confirmDelete = async () => {
    try {
      await Api.post("/admin/remove-product", null, {
        params: { product_id: id },
      });
      toast.success("Product deleted");
      navigate("/admin/products");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex  sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            Product Edit Page
          </h2>
          <button
            onClick={() => navigate("/admin/products")}
            className="self-end sm:self-auto flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg shadow-sm"
          >
            Back
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4 sm:space-y-5 order-2 md:order-1 ">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  name="p_name"
                  value={product.p_name}
                  onChange={changeValue}
                  className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="p_description"
                  value={product.p_description}
                  onChange={changeValue}
                  rows="4"
                  className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="p_price"
                    value={product.p_price}
                    onChange={changeValue}
                    className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="p_discount"
                    value={product.p_discount}
                    onChange={changeValue}
                    className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="p_category"
                  value={product.p_category}
                  onChange={changeValue}
                  className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base"
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="books">Books</option>
                  <option value="home">Home</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (validate()) setModal("update");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setModal("delete")}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="space-y-4 flex flex-col items-center md:items-start order-1 md:order-2">
              <div className="w-full max-w-sm aspect-[2] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview || placeholder}
                  alt="product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 w-full max-w-sm">
                <label className="text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:border-blue-500 transition">
                    <p className="text-sm text-gray-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      {modal === "update" && (
        <ConfirmModal
          title="Update Product"
          message={`Are you sure you want to update ${product.p_name}?`}
          confirmText="Update"
          confirmColor="bg-blue-600"
          onConfirm={confirmUpdate}
          close={() => setModal(null)}
        />
      )}
      {modal === "delete" && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete ${product.p_name}?`}
          confirmText="Delete"
          confirmColor="bg-red-600"
          onConfirm={confirmDelete}
          close={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default ProductEdit;
