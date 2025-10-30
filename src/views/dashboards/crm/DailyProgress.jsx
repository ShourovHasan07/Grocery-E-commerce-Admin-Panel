"use client";

import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";


import { useSession } from "next-auth/react";

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

import DailyProgressSkeleton from "./DailyProgressSkeleton"

import pageApiHelper from "@/utils/pageApiHelper";

export default function DailyProgress() {

  const { data: session } = useSession();
  const token = session?.accessToken;
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetch7DaysData = async () => {
      if (token) {
        try {
          const result = await pageApiHelper.get(
            "dashboard/performance-ratio",
            {},
            token,
          );

          if (result.success && result?.data?.data) {
            setPerformance(result.data.data);
          }
        } catch (error) {
          // console.log("Error fetching booking stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetch7DaysData();
  }, [token]);

  return (
    <Card className="bs-full p-6">
      <h3 className="text-lg font-semibold text-[#2c2c2c]">
        Performance Ratio
      </h3>
      <p className="text-gray-500 text-sm mb-4">Last 7 days performance</p>

      {loading ? (
        <DailyProgressSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height="85%" debounce="1">
          <BarChart data={performance} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              itemStyle={{ color: "#000" }}
              labelStyle={{ color: "#000" }}
              cursor={{ fill: "transparent" }}
            />

            {/* Bar with hover opacity change */}
            <Bar
              dataKey="count"
              fill="#8884d8"
              radius={[6, 6, 0, 0]}
              activeBar={{
                style: { opacity: 0.9 },
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
