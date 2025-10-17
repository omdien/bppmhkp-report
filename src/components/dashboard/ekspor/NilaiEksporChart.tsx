"use client";
import React, { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { EksporBulanan, EksporHarian } from "@/services/DashboardServices";

// Dynamic import untuk ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface NilaiEksporChartProps {
  dataBulanan: EksporBulanan[];
  dataHarian: EksporHarian[];
  startDate: string;
  endDate: string;
}

export default function NilaiEksporChart({
  dataBulanan,
  dataHarian,
  startDate,
  endDate,
}: NilaiEksporChartProps) {
  // Cek apakah periode dalam 1 bulan
  const isSameMonth = useMemo(() => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  }, [startDate, endDate]);

  const { categories, series } = useMemo(() => {
    if (isSameMonth) {
      // Data harian
      return {
        categories: dataHarian.map((d) => (d.TANGGAL ?? d.TANGGAL ?? "").toString()),
        // series: dataHarian.map((d) => d.JUMLAH ?? 0),
        series: [
          {
            name: "Nilai Ekspor (IDR)",
            type: "line",
            data: dataHarian.map((d) =>
              (d.NILAIIDR ?? d.NILAIIDR) / 1_000_000
            ),
          },
          {
            name: "Nilai Ekspor (USD)",
            type: "line",
            data: dataHarian.map((d) =>
              (d.NILAIUSD ?? d.NILAIUSD) / 1_000_000
            ),
          },
        ],
      };
    } else {
      // Data bulanan
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return {
        categories: dataBulanan.map((d) =>
          d.BULAN && d.BULAN >= 1 && d.BULAN <= 12 ? monthNames[d.BULAN - 1] : ""
        ),
        // series: dataBulanan.map((d) => d.JUMLAH ?? 0),
        series: [
          {
            name: "Nilai Ekspor (IDR)",
            type: "line",
            data: dataBulanan.map((d) =>
              (d.NILAIIDR ?? d.NILAIIDR) / 1_000_000
            ),
          },
          {
            name: "Nilai Ekspor (USD)",
            type: "line",
            data: dataBulanan.map((d) =>
              (d.NILAIUSD ?? d.NILAIUSD) / 1_000_000
            ),
          },
        ],
      };
    }
  }, [isSameMonth, dataHarian, dataBulanan]);

  // Chart options
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    colors: ["#465FFF", "#22C55E"], // Biru = IDR, Hijau = USD
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: "#6B7280",
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: isSameMonth ? "dd MMM yyyy" : "MMM yyyy",
      },
      y: {
        formatter: (val, opts) =>
          opts.seriesIndex === 0
            ? `${val.toFixed(2)} Juta IDR`
            : `${val.toFixed(2)} Juta USD`,
      },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      type: "category",
      labels: {
        rotate: isSameMonth ? -45 : 0,
        style: { colors: "#6B7280", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: "Nilai Ekspor (IDR)",
        title: {
          text: "IDR / 1.000.000 (Juta)",
          style: { fontSize: "12px", color: "#465FFF" },
        },
        labels: {
          style: { colors: "#465FFF" },
          formatter: (val) => `${val.toFixed(0)}`,
        },
        forceNiceScale: true,
      },
      {
        opposite: true,
        seriesName: "Nilai Ekspor (USD)",
        title: {
          text: "USD / 1.000.000 (Juta)",
          style: { fontSize: "12px", color: "#22C55E" },
        },
        labels: {
          style: { colors: "#22C55E" },
          formatter: (val) => `${val.toFixed(0)}`,
        },
        forceNiceScale: true,
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Nilai Ekspor
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Periode {isSameMonth ? "Harian" : "Bulanan"}
        </p>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
