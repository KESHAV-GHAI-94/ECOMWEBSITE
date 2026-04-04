const OrdersOverview = ({ orders = [] }) => {
  const summary = {
    pending: orders.filter((o) => o.status === "pending").length,
    processed: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status?.toLowerCase() === "cancelled")
      .length,
  };

  const total =
    summary.pending +
    summary.processed +
    summary.shipped +
    summary.delivered +
    summary.cancelled;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
      <h2 className="font-semibold text-sm md:text-lg text-gray-800 mb-3">
        Orders Overview
      </h2>
      <div className="space-y-2">
        <Row
          label="Pending"
          value={summary.pending}
          total={total}
          color="bg-yellow-500"
          badge="bg-yellow-100 text-yellow-700"
        />
        <Row
          label="Processed"
          value={summary.processed}
          total={total}
          color="bg-blue-500"
          badge="bg-blue-100 text-blue-700"
        />
        <Row
          label="Shipped"
          value={summary.shipped}
          total={total}
          color="bg-purple-500"
          badge="bg-purple-100 text-purple-700"
        />
        <Row
          label="Delivered"
          value={summary.delivered}
          total={total}
          color="bg-green-500"
          badge="bg-green-100 text-green-700"
        />
        <Row
          label="Cancelled"
          value={summary.cancelled}
          total={total}
          color="bg-red-500"
          badge="bg-red-100 text-red-700"
        />
      </div>
    </div>
  );
};

const Row = ({ label, value, total, color, badge }) => {
  const percentage = total ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`px-2 py-1 text-xs rounded ${badge}`}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className={`${color} h-2 rounded`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default OrdersOverview;
