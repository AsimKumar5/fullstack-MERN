import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const fallbackData = [
  { day: "Mon", value: 105000 },
  { day: "Tue", value: 108000 },
  { day: "Wed", value: 107500 },
  { day: "Thu", value: 112000 },
  { day: "Fri", value: 115000 },
  { day: "Sat", value: 113500 },
  { day: "Sun", value: 125450 }
];

function PriceChart({ data = fallbackData }) {

  return (
    <div className="chart-container">

      <ResponsiveContainer width="100%" height={350}>

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default PriceChart;