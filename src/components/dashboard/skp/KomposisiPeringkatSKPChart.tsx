"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { KomposisiPeringkatSKP } from "@/services/DashboardServices";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface KomposisiPeringkatSKPChartProps {
  data: KomposisiPeringkatSKP[];
}

const KomposisiPeringkatSKPChart: React.FC<KomposisiPeringkatSKPChartProps> = ({ data }) => {
  const { theme } = useTheme();

  // Urutkan peringkat agar konsisten A → B → C
  const sortedData = [...data].sort((a, b) => a.peringkat.localeCompare(b.peringkat));

  const labels = sortedData.map((item) => item.peringkat);
  const series = sortedData.map((item) => item.jumlah);

  const colors = ["#22c55e", "#3b82f6", "#f59e0b"]; // A = hijau, B = biru, C = kuning

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
    },
    labels,
    colors,
    legend: {
      position: "bottom",
      fontSize: "13px",
      labels: {
        colors: theme === "dark" ? "#e5e7eb" : "#374151",
      },
      markers: { width: 12, height: 12, radius: 12 },
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
          },
        },
      },
    },
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ReactApexChart options={options} series={series} type="donut" height={300} />
    </div>
  );
};

export default KomposisiPeringkatSKPChart;
