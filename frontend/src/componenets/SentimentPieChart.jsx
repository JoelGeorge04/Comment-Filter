// components/SentimentPieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#0073e6", "#e63946"]; // Blue for positive, red for negative

export default function SentimentPieChart({ positive, negative }) {
  const data = [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );
}
