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
      show: false, // legend disembunyikan agar tidak memengaruhi ukuran donat
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
          size: "50%", // sama seperti DistribusiSkalaUsahaChart
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
            value: {
              fontSize: "12px",
              color: theme === "dark" ? "#e5e7eb" : "#374151",
              formatter: (val: string) => {
                const num = Number(val);
                return isNaN(num) ? val : num.toLocaleString();
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
      {/* Pastikan ukuran box sama persis */}
      <div className="w-[240px] h-[240px] flex justify-center items-center">
        <ReactApexChart options={options} series={series} type="donut" height={240} />
      </div>

      {/* Custom legend horizontal agar konsisten */}
      <div className="w-full overflow-x-auto mt-3 scrollbar-thin">
        <div className="flex justify-center gap-3 px-2 whitespace-nowrap">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="max-w-[120px] truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KomposisiPeringkatSKPChart;
