import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";

const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Users"
        value={stats.total_users}
        icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
        color="bg-blue-500"
      />
      <StatCard
        title="Products"
        value={stats.total_products}
        icon={<Package className="w-4 h-4 sm:w-5 sm:h-5" />}
        color="bg-purple-500"
      />
      <StatCard
        title="Orders"
        value={stats.total_orders}
        icon={<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
        color="bg-orange-500"
      />
      <StatCard
        title="Revenue"
        value={`₹${stats.total_revenue}`}
        icon={<IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />}
        color="bg-green-500"
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-xs sm:text-sm">{title}</p>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
        {value || 0}
      </h2>
    </div>
    <div className={`${color} text-white p-2 sm:p-3 rounded-lg`}>{icon}</div>
  </div>
);

export default Stats;
