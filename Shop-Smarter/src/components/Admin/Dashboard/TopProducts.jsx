import { Trophy } from "lucide-react";

const TopProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-2 sm:p-4.5">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="text-yellow-500" size={20} />
        <h2 className="font-semibold text-sm md:text-lg text-gray-800">
          Top Products
        </h2>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-400 text-sm">No products found</p>
      ) : (
        <div className="space-y-1.5">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-purple-50 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {index + 1}. {product.p_name}
                </p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {product.total_sold} sold
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProducts;