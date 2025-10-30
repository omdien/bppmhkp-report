"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TopUPISKP = {
  nama_upi: string;
  jumlah: number;
};

type Props = {
  data: TopUPISKP[];
};

const Top10UPISKPChart: React.FC<Props> = ({ data }) => {
  const { theme } = useTheme();
  const top10 = data.slice(0, 10).sort((a, b) => a.jumlah - b.jumlah); // sort ascending biar urutan rapi

  const series = [
    {
      name: "Jumlah SKP",
      data: top10.map((item) => item.jumlah),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        distributed: true,
        barHeight: "65%",
      },
    },
    colors: [
      "#6366f1", // indigo
      "#8b5cf6",
      "#3b82f6",
      "#0ea5e9",
      "#10b981",
      "#14b8a6",
      "#22c55e",
      "#f59e0b",
      "#ef4444",
      "#e11d48",
    ],
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme === "dark" ? "#fff" : "#111"],
        fontWeight: "bold",
      },
      formatter: (val: number) => val.toLocaleString("id-ID"),
    },
    xaxis: {
      categories: top10.map((item) => item.nama_upi),
      labels: {
        style: {
          colors: theme === "dark" ? "#e5e7eb" : "#374151",
          fontSize: "12px",
        },
      },
      title: {
        text: "Jumlah SKP",
        style: {
          color: theme === "dark" ? "#e5e7eb" : "#374151",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#e5e7eb" : "#374151",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val.toLocaleString()} SKP`,
      },
    },
    grid: {
      borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
      strokeDashArray: 3,
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">
        🏆 Top 10 UPI (Unit Pengolahan Ikan)
      </h2>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Top10UPISKPChart;
