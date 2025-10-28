"use client";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateLast7DaysData = () => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);

    date.setDate(today.getDate() - i);

    const dayName = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });

    // Generate random income between 150 and 500
    const income = Math.floor(Math.random() * (500 - 150 + 1)) + 150;

    data.push({ name: dayName, income });
  }

  return data;
};

const data = generateLast7DaysData();

export default function DailyProgress() {
  return (
    <Card className="bs-full p-6">
      <h3 className="text-lg font-semibold text-[#2c2c2c]">
        Performance Ratio
      </h3>
      <p className="text-gray-500 text-sm mb-4">Last 7 days performance</p>

      <ResponsiveContainer width="100%" height="85%" debounce="1">
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            itemStyle={{ color: "#000" }}
            labelStyle={{ color: "#000" }}
            cursor={{ fill: "transparent" }}
          />

          {/* Bar with hover opacity change */}
          <Bar
            dataKey="income"
            fill="#8884d8"
            radius={[6, 6, 0, 0]}
            activeBar={{
              style: { opacity: 0.9 },
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
