"use client";
import { useState, useEffect } from "react";


// Next Imports
import dynamic from "next/dynamic";

import { useSession } from "next-auth/react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";

import pageApiHelper from "@/utils/pageApiHelper";

// Styled Component Imports
const AppReactApexCharts = dynamic(
  () => import("@/libs/styles/AppReactApexCharts"),
  { ssr: false }
);

const SkillWiseRatio = () => {
  // Hooks
  const theme = useTheme();

  const { data: session } = useSession();
  const token = session?.accessToken;
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [coverage, setCoverage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const result = await pageApiHelper.get(
            "dashboard/skill-wise-ratio",
            {},
            token,
          );

          if (result.success && result?.data?.data) {
            const data = result.data.data;


            // Ensure we have valid arrays and data
            if (data?.series && Array.isArray(data.series) && data.series.length > 0 &&
              data?.labels && Array.isArray(data.labels) && data.labels.length > 0) {
              setSeries(data.series);
              setLabels(data.labels);
              setCoverage(data.coverage || 0);
            }
          }
        } catch (error) {
          // console.log("Error fetching booking stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [token])

  const options = {
    chart: {
      width: "100%",
      height: "100%",
    },
    labels: labels,
    stroke: {
      width: 0,
    },
    colors: [
      "var(--mui-palette-success-main)",
      "rgba(var(--mui-palette-success-mainChannel) / 0.8)",
      "rgba(var(--mui-palette-success-mainChannel) / 0.6)",
      "rgba(var(--mui-palette-success-mainChannel) / 0.4)",
    ],
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${Number.parseInt(val)}%`;
      },
    },
    legend: {
      show: true,
      position: "bottom",
      offsetY: 10,
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === "rtl" ? 8 : -4,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
      fontSize: "13px",
      fontWeight: 400,
      labels: {
        colors: "var()",
        useSeriesColors: false,
      },
    },
    grid: {
      padding: {
        top: 15,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            value: {
              fontSize: "24px",
              color: "var(--mui-palette-text-primary)",
              fontWeight: 500,
              offsetY: -20,
            },
            name: { offsetY: 20 },
            total: {
              show: true,
              fontSize: "0.9375rem",
              fontWeight: 400,
              label: "AVG. Bookings",
              color: "var(--mui-palette-text-secondary)",
              formatter() {
                return `${coverage}%`;
              },
            },
          },
        },
      },
    },
  };

  return (
    <Card className="bs-full">
      <CardHeader
        title="Skill wise Ratio"
        subheader="Spending on various skills"
      />
      <CardContent>
        {loading ? (
          <div style={{ width: '100%', height: 370, minWidth: 300, minHeight: 370, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Skeleton variant="circular" width={200} height={200} />
          </div>) : (
          <AppReactApexCharts
            type="donut"
            height={370}
            width="100%"
            series={series}
            options={options}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SkillWiseRatio;
