import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function FactorBarChart({ data }) {
  return (
    <div className="glass panel-outline relative h-[390px] overflow-hidden rounded-[2rem] p-6 shadow-panel">
      <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-sky-300/10 blur-3xl" />
      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="section-badge">Explainability</div>
          <h3 className="mt-4 font-display text-2xl text-white">Factor Impact</h3>
        </div>
        <p className="max-w-xs text-sm text-sky-100/70">
          SHAP-based contribution of the strongest drivers behind this score.
        </p>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 24, bottom: 10, left: 20 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis type="number" stroke="#bfdbfe" tick={{ fill: "#dbeafe", fontSize: 12 }} />
          <YAxis
            dataKey="feature"
            type="category"
            width={120}
            stroke="#bfdbfe"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#e2e8f0", fontSize: 12 }}
          />
          <Bar dataKey="impact" radius={[10, 10, 10, 10]} barSize={28}>
            {data.map((entry) => (
              <Cell
                key={entry.feature}
                fill={entry.impact >= 0 ? "#34d399" : "#f97360"}
              />
            ))}
            <LabelList
              dataKey="impact"
              position="right"
              formatter={(value) => `${value > 0 ? "+" : ""}${value}`}
              fill="#f8fafc"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
