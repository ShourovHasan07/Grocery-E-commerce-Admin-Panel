"use client";

// Next Imports
import dynamic from "next/dynamic";

// MUI Imports
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";

// Styled Component Imports
const AppReactApexCharts = dynamic(
  () => import("@/libs/styles/AppReactApexCharts"),
  { ssr: false }
);

const series = [{ data: [32, 52, 72, 94, 116, 94, 72] }];

const BarChartRevenueGrowth = ({ loading, data }) => {
  // Hook
  const theme = useTheme();

  // Vars
  const successColorWithOpacity = "var(--mui-palette-success-lightOpacity)";

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      width: "100%",
      height: "100%",
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        distributed: true,
        columnWidth: "55%",
      },
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      successColorWithOpacity,
      successColorWithOpacity,
      successColorWithOpacity,
      successColorWithOpacity,
      "var(--mui-palette-success-main)",
      successColorWithOpacity,
      successColorWithOpacity,
    ],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    grid: {
      show: false,
      padding: {
        top: -15,
        left: 0,
        right: 0,
        bottom: -5,
      },
    },
    xaxis: {
      categories: ["M", "T", "W", "T", "F", "S", "S"],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: "on",
      labels: {
        style: {
          colors: "var(--mui-palette-text-disabled)",
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize,
        },
      },
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 1240,
        options: {
          chart: {
            width: 150,
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          plotOptions: { bar: { columnWidth: "65%" } },
          options: {
            chart: {
              width: 200,
            },
          },
        },
      },
      {
        breakpoint: 410,
        options: {
          chart: {
            width: 150,
          },
          plotOptions: {
            bar: { columnWidth: "60%" },
          },
        },
      },
    ],
  };

  return (
    <Card className="bs-full">
      <CardContent className="flex justify-between gap-2">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-y-2">
            <Typography variant="h5">Total Bookings</Typography>
            <Typography>This Monthly</Typography>
          </div>
          <div className="flex flex-col gap-y-2 items-start">
            {loading ? (
              <div className="mt-8">
                <Skeleton variant="text" width={80} height={42} />
                <Skeleton variant="rounded" width={40} height={18} />
              </div>
            ) : (
              <>
                <Typography variant="h3">{data?.count || 0}</Typography>
                <Chip variant="tonal" size="small" color="success" label={data?.percentage || "0%"} />
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div className="mt-4 flex gap-3 items-baseline">
            <Skeleton variant="rectangular" className="rounded" width={10} height={80} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={90} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={100} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={110} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={130} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={110} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={100} />
            <Skeleton variant="rectangular" className="rounded" width={10} height={85} />
          </div>
        ) : (
          <div style={{ width: 170, height: 150, minWidth: 170, minHeight: 150 }}>
            <AppReactApexCharts
              type="bar"
              width="100%"
              height="100%"
              series={series}
              options={options}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BarChartRevenueGrowth;
