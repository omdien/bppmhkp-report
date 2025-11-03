"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TrenBulananSKP } from "@/services/DashboardServices";

// 🟢 Dynamic import react-apexcharts agar tidak dieksekusi di server
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: TrenBulananSKP[];
}

export default function TrenBulananSKPChart({ data }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }
  }, []);

  const categories = data.map((item) => item.bulan);
  const seriesData = data.map((item) => item.jumlah);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: isDark ? "#cbd5e1" : "#374151",
    },
    theme: { mode: isDark ? "dark" : "light" },
    stroke: { curve: "smooth", width: 3, colors: ["#2563eb"] },
    dataLabels: { enabled: true, style: { colors: [isDark ? "#93c5fd" : "#1d4ed8"] } },
    xaxis: {
      categories,
      labels: { rotate: -45, style: { colors: isDark ? "#cbd5e1" : "#374151" } },
    },
    yaxis: { labels: { style: { colors: isDark ? "#cbd5e1" : "#374151" } } },
  };

  const series = [{ name: "Jumlah SKP", data: seriesData }];

  return (
    <div
      className={`rounded-lg border ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
        } shadow-md transition-all duration-300`}
    >
      <div
        className={`px-4 py-3 border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-gray-50"
          }`}
      >
        <h2
          className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"
            }`}
        >
          📈 Tren Penerbitan SKP
        </h2>
      </div>

      <div className="p-4">
        {data.length > 0 ? (
          <ReactApexChart options={options} series={series} type="line" height={320} />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Tidak ada data tren bulanan.
          </p>
        )}
      </div>
    </div>
  );
}
