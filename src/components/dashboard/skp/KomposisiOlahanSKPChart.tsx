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

  const colors = [
    "#14b8a6", // teal
    "#3b82f6", // blue
    "#f59e0b", // amber
    "#ef4444", // red
    "#22c55e", // green
    "#6366f1", // indigo
    "#a855f7", // purple
    "#eab308", // yellow
    "#0ea5e9", // cyan
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
      height: 260,
    },
    labels,
    colors,
    legend: {
      show: false, // 🔹 kita sembunyikan legend bawaan Apex, pakai custom legend di bawah
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
    stroke: {
      colors: [theme === "dark" ? "#1f2937" : "#fff"],
    },
    theme: {
      mode: theme === "dark" ? "dark" : "light",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%", // 🔹 diameter seragam
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total SKP",
              fontSize: "14px",
              color: theme === "dark" ? "#e5e7eb" : "#374151",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toLocaleString();
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 260 },
        },
      },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Chart */}
      <div className="w-[240px] h-[240px] flex justify-center items-center">
        <ReactApexChart options={options} series={series} type="donut" height={240} />
      </div>

      {/* Legend Custom (horizontal scroll kalau panjang) */}
      <div className="w-full overflow-x-auto mt-3 scrollbar-thin">
        <div className="flex justify-center gap-3 px-2 whitespace-nowrap">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-1 text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              ></span>
              <span>{label || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KomposisiOlahanSKPChart;
