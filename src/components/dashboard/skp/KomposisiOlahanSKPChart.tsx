"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { KomposisiOlahanSKP } from "@/services/DashboardServices"; // pastikan path sesuai

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface KomposisiOlahanSKPChartProps {
  data: KomposisiOlahanSKP[];
}

const KomposisiOlahanSKPChart: React.FC<KomposisiOlahanSKPChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Urutkan data dari jumlah terbesar
  const sortedData = [...data].sort((a, b) => b.jumlah - a.jumlah);

  const labels = sortedData.map((item) => item.jenis_olahan);
  const series = sortedData.map((item) => item.jumlah);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
    },
    labels,
    legend: {
      position: "bottom",
      fontSize: "13px",
      labels: {
        colors: theme === "dark" ? "#e5e7eb" : "#374151",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme === "dark" ? "#fff" : "#111"],
        fontSize: "12px",
        fontWeight: "bold",
      },
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val.toLocaleString()} SKP`,
      },
    },
    colors: [
      "#14b8a6", // teal
      "#3b82f6", // blue
      "#f59e0b", // amber
      "#ef4444", // red
      "#22c55e", // green
      "#6366f1", // indigo
      "#a855f7", // purple
      "#eab308", // yellow
    ],
    stroke: {
      colors: [theme === "dark" ? "#1f2937" : "#fff"],
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total SKP",
              fontSize: "14px",
              color: theme === "dark" ? "#e5e7eb" : "#374151",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return total.toLocaleString();
              },
            },
            value: {
              fontSize: "12px",
              color: theme === "dark" ? "#e5e7eb" : "#374151",
              formatter: (val: number) => val.toLocaleString(),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 320 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ReactApexChart options={options} series={series} type="donut" height={380} />
    </div>
  );
};

export default KomposisiOlahanSKPChart;
