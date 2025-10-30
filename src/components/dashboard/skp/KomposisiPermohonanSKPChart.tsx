"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { KomposisiPermohonanSKP } from "@/services/DashboardServices";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface KomposisiPermohonanSKPChartProps {
    data: KomposisiPermohonanSKP[];
}

const KomposisiPermohonanSKPChart: React.FC<KomposisiPermohonanSKPChartProps> = ({ data }) => {
    const { theme } = useTheme();

    // Normalisasi label agar lebih rapi
    const sortedData = [...data].sort((a, b) =>
        a.jenis_permohonan.localeCompare(b.jenis_permohonan)
    );

    const labels = sortedData.map((item) => item.jenis_permohonan);
    const series = sortedData.map((item) => item.jumlah);

    const colors = ["#3b82f6", "#f43f5e"]; // Biru: Baru, Merah: Perpanjangan

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
            markers: {
                size: 12, // ✅ valid
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

export default KomposisiPermohonanSKPChart;
