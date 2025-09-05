"use client";
import React, { useEffect, useState } from "react";
import { BoxIconLine, FrekIcon, RpIcon, UsdIcon } from "@/icons";
import DashboardService, { SummaryEkspor } from "@/services/DashboardServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";

/* ------------------ Helpers ------------------ */
const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

const formatNumber2Dec = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatCurrency = (value: number, currency: "IDR" | "USD") =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

/* ------------------ Reusable Card ------------------ */
type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <span className="text-base font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
    <div className="flex items-end justify-end mt-5">
      <h4 className="font-bold text-gray-800 text-[25px] dark:text-white/90">
        {value}
      </h4>
    </div>
  </div>
);

/* ------------------ Main Component ------------------ */
export const ResumeEkspor = () => {
  const [data, setData] = useState<SummaryEkspor | null>(null);
  const { periode } = usePeriode(); // ambil periode dari context
  const { user } = useUser();

  useEffect(() => {
    if (!user) return; // ⬅️ kalau user null, hentikan eksekusi
    const loadData = async () => {
      try {
        if (!periode.startDate || !periode.endDate) return;
        const result = await DashboardService.getSummaryEkspor(
          // "00.1", // kode bisa juga dibuat dinamis kalau perlu
          user.kd_unit,
          periode.startDate,
          periode.endDate
        );
        setData(result);
      } catch (err) {
        console.error("Gagal fetch summary ekspor:", err);
      }
    };
    loadData();
  }, [periode,user]); // akan refetch setiap kali periode berubah

  const stats = [
    {
      icon: <FrekIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Frekuensi",
      value: formatNumber(data?.jumFreq ?? 0),
    },
    {
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Volume (Ton)",
      value: formatNumber2Dec((data?.totalVolume ?? 0) / 1000),
    },
    {
      icon: <RpIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Nilai IDR (Juta)",
      value: formatCurrency((data?.totalNilaiIDR ?? 0) / 1_000_000, "IDR"),
    },
    {
      icon: <UsdIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Nilai USD (Juta)",
      value: formatCurrency((data?.totalNilaiUSD ?? 0) / 1_000_000, "USD"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
};
