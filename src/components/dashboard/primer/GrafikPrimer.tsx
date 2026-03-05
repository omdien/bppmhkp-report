import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export type RekapPrimerItem = {
  propinsi: string;
  total: number;
  CPIB: number;
  CBIB: number;
  CPPIB: number;
  CPOIB: number;
  CDOIB: number;
  CBIB_Kapal?: number; // Tetap simpan ini sesuai key dari backend
};

type ApexAxisChartSeries = {
  name: string;
  data: number[];
}[];

type GrafikPrimerProps = {
  rekapPrimer: RekapPrimerItem[];
};

const GrafikPrimer: React.FC<GrafikPrimerProps> = ({ rekapPrimer }) => {
  const convertToGroupedSeries = (data: RekapPrimerItem[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { categories: [] as string[], series: [] as ApexAxisChartSeries };
    }

    // Mapping untuk mengubah label yang salah menjadi benar di tampilan
    const izinMapping = [
      { key: "CPIB", label: "CPIB" },
      { key: "CBIB", label: "CBIB" },
      { key: "CPPIB", label: "CPPIB" },
      { key: "CPOIB", label: "CPOIB" },
      { key: "CDOIB", label: "CDOIB" },
      { key: "CBIB_Kapal", label: "CPIB KAPAL" }, // Data dari CBIB_Kapal, label jadi CPIB KAPAL
    ];

    const categories = data.map((item) => item.propinsi.toUpperCase());

    const series = izinMapping.map((item) => ({
      name: item.label, // Menggunakan label yang sudah diperbaiki
      data: data.map(
        (dataItem) => (dataItem[item.key as keyof RekapPrimerItem] as number) || 0
      ),
    }));

    return { categories, series };
  };

  const { categories, series } = useMemo(
    () => convertToGroupedSeries(rekapPrimer),
    [rekapPrimer]
  );

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      fontFamily: '"Inter", sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '80%', // Agar bar tidak terlalu tipis
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#004D40", fontSize: "12px" },
      },
    },
    tooltip: { 
      enabled: true,
      y: {
        formatter: (val) => `${val} Izin`
      }
    },
    legend: { 
      position: "bottom",
      horizontalAlign: "center",
      offsetY: 8
    },
    dataLabels: { enabled: false },
    // Menyesuaikan warna agar konsisten dengan ResumeCard (CPIB Kapal pakai warna cyan/teal)
    colors: ["#0D8AF5", "#FCD58A", "#CF0F47", "#00695C", "#4BA38A", "#00ACC1"],
  };

  return (
    <div className="w-full overflow-hidden">
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
        height={Math.max(categories.length * 45, 400)} // Dynamic height agar tidak menumpuk jika provinsi banyak
      />
    </div>
  );
};

export default GrafikPrimer;