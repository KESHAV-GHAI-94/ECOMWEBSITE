import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const chartData = [
  { day: "Mon", sales: 400 },
  { day: "Tue", sales: 600 },
  { day: "Wed", sales: 300 },
  { day: "Thu", sales: 800 },
  { day: "Fri", sales: 500 },
  { day: "Sat", sales: 900 },
  { day: "Sun", sales: 700 }
];

const SalesChart = () => {

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Weekly Sales
      </h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={chartData}>

          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default SalesChart;