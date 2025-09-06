"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import { useState, useMemo } from "react";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { EksporBulanan, EksporHarian } from "@/services/DashboardServices";

// ApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface FrequensiChartProps {
  dataHarian: EksporHarian[];
  dataBulanan: EksporBulanan[];
  startDate: string;
  endDate: string;
}

export default function FrequensiChart({
  dataHarian,
  dataBulanan,
  startDate,
  endDate,
}: FrequensiChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  // helper untuk cek apakah dalam 1 bulan
  const isSameMonth = useMemo(() => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  }, [startDate, endDate]);

  // siapkan data chart
  const { categories, seriesData } = useMemo(() => {
    if (isSameMonth) {
      // data harian
      return {
        categories: dataHarian.map((d) => d.TANGGAL.toString()), // ex: "1", "2", "3"
        seriesData: dataHarian.map((d) => d.JUMLAH),
      };
    } else {
      // data bulanan
      const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      return {
        categories: dataBulanan.map((d) => monthNames[d.BULAN - 1]),
        seriesData: dataBulanan.map((d) => d.JUMLAH),
      };
    }
  }, [isSameMonth, dataHarian, dataBulanan]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: "Jumlah" },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: true },
      y: { formatter: (val: number) => `${val}` },
    },
  };

  const series = [
    {
      name: "Jumlah",
      data: seriesData,
    },
  ];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Frekuensi Ekspor
        </h3>
        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
