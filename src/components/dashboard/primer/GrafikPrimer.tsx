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
  CBIB_Kapal?: number;
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

    const izinKeys = [
      "CPIB",
      "CBIB",
      "CPPIB",
      "CPOIB",
      "CDOIB",
      "CBIB_Kapal",
    ];

    const categories = data.map((item) => item.propinsi.toUpperCase());

    const series = izinKeys.map((key) => ({
      name: key,
      data: data.map(
        (item) => (item[key as keyof RekapPrimerItem] as number) || 0
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
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#004D40", fontSize: "12px" },
      },
    },
    tooltip: { enabled: true },
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    colors: ["#0071CE", "#F7C04A", "#CF0F47", "#004D40", "#1E7E68", "#E6D8AE"],
  };

  return (
    <div>
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
        height={categories.length * 40}
      />
    </div>
  );
};

export default GrafikPrimer;
