"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { TopProvinsiSKP } from "@/services/DashboardServices"; // pastikan interface sudah ada

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TopProvinsiSKPChartProps {
  data: TopProvinsiSKP[];
}

const TopProvinsiSKPChart: React.FC<TopProvinsiSKPChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Sort dan ambil top 10
  const sortedData = [...data]
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 10)
    .reverse(); // agar provinsi dengan jumlah terbesar di bawah (untuk tampilan horizontal bar)

  const categories = sortedData.map((item) => item.provinsi);
  const series = [
    {
      name: "Jumlah SKP",
      data: sortedData.map((item) => item.jumlah),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "65%",
        distributed: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        colors: [theme === "dark" ? "#e5e7eb" : "#111827"],
      },
      formatter: (val: number) => val.toLocaleString(),
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme === "dark" ? "#d1d5db" : "#374151",
          fontSize: "13px",
        },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#d1d5db" : "#374151",
          fontSize: "13px",
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
    colors: ["#3b82f6"],
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: { bar: { barHeight: "50%" } },
          dataLabels: { style: { fontSize: "11px" } },
        },
      },
    ],
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default TopProvinsiSKPChart;
