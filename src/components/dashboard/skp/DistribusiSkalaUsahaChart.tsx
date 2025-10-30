"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { DistribusiSkalaUsahaSKP } from "@/services/DashboardServices"; 
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DistribusiSkalaUsahaChartProps {
  data: DistribusiSkalaUsahaSKP[];
}

const DistribusiSkalaUsahaChart: React.FC<DistribusiSkalaUsahaChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const labels = data.map((item) => item.skala_usaha);
  const series = data.map((item) => item.jumlah);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      toolbar: { show: false },
      background: "transparent",
    },
    labels,
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: {
        colors: theme === "dark" ? "#d1d5db" : "#374151",
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val.toLocaleString()} SKP`,
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      style: {
        fontSize: "13px",
        colors: [theme === "dark" ? "#f3f4f6" : "#111827"],
      },
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
    colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total SKP",
              color: theme === "dark" ? "#f3f4f6" : "#111827",
              fontSize: "14px",
              formatter: () =>
                series.reduce((acc, val) => acc + val, 0).toLocaleString(),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { width: "100%" },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ReactApexChart options={options} series={series} type="donut" height={320} />
    </div>
  );
};

export default DistribusiSkalaUsahaChart;
