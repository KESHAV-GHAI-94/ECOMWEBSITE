import { useState } from "react";
import Api from "../../Api";
import { X, Upload } from "lucide-react";
import { toast } from "react-toastify";

const CreateProductModal = ({ close, refresh }) => {
  const [preview, setPreview] = useState(null);
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.p_name.value.trim();
    const description = form.p_description.value.trim();
    const price = form.p_price.value;
    const discount = form.p_discount.value;
    const category = form.p_category.value.trim();
    if (!name) return toast.error("Product name is required");
    if (!description) return toast.error("Product description is required");
    if (!price) return toast.error("Product price is required");
    if (!category) return toast.error("Product category is required");
    if (discount > 100) {
      return toast.error("Discount cannot exceed 100%");
    }
    const data = new FormData(form);
    try {
      await Api.post("/admin/create-product", data);
      toast.success("Product created successfully");
      refresh();
      close();
    } catch (err) {
      toast.error("Failed to create product");
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg relative max-h-[93vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 sticky top-0 bg-white">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Create Product
          </h2>
          <button
            type="button"
            onClick={close}
            className="text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-3 space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Product Image
            </label>
            <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg h-32 sm:h-36 md:h-40 cursor-pointer hover:border-blue-500 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload size={22} />
                  <span className="text-xs sm:text-sm mt-1">
                    Click to upload image
                  </span>
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>
          <input
            name="p_name"
            placeholder="Product Name"
            required
            className="border border-gray-300 p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            name="p_description"
            placeholder="Product Description"
            rows="3"
            className="border border-gray-300 p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              name="p_price"
              type="number"
              placeholder="Price"
              required
              className="border border-gray-300 p-2.5 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="p_discount"
              type="number"
              placeholder="Discount %"
              defaultValue={0}
              min="0"
              max="100"
              step="1"
              onInput={(e) => {
                if (e.target.value > 100) e.target.value = 100;
              }}
              className="border border-gray-300 p-2.5 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            name="p_category"
            required
            className="border border-gray-300 p-2.5 w-full rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={close}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductModal;
