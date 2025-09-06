"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Periode, EksporBulanan, EksporHarian } from "@/types/dashboard";

// Dynamic import untuk ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface NilaiEksporChartProps {
  dataBulanan: EksporBulanan[];
  dataHarian: EksporHarian[];
  periode: Periode; // "bulanan" | "harian"
}

export default function NilaiEksporChart({
  dataBulanan,
  dataHarian,
  periode,
}: NilaiEksporChartProps) {
  // Pilih data sesuai periode
  const data = periode === "bulanan" ? dataBulanan : dataHarian;

  // X-axis (bulan / tanggal)
  const categories =
    periode === "bulanan"
      ? data.map((d) => (d.bulan ?? d.BULAN)) // fallback ke BULAN kalau dari DB uppercase
      : data.map((d) => (d.tanggal ?? d.TANGGAL));

  // Series IDR dan USD (dibagi 1.000.000 biar jutaan)
  const series = [
    {
      name: "Nilai Ekspor (IDR)",
      type: "line",
      data: data.map((d) =>
        (d.nilai_idr ?? d.NILAIIDR) / 1_000_000
      ),
    },
    {
      name: "Nilai Ekspor (USD)",
      type: "line",
      data: data.map((d) =>
        (d.nilai_usd ?? d.NILAIUSD) / 1_000_000
      ),
    },
  ];

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
        format: periode === "harian" ? "dd MMM yyyy" : "MMM yyyy",
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
        rotate: periode === "harian" ? -45 : 0,
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
          Periode {periode === "harian" ? "Harian" : "Bulanan"}
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
