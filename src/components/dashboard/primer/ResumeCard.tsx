"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

/* ------------------ Helpers ------------------ */
const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

/* ------------------ Color Mapping ------------------ */
const lightColors: Record<string, string> = {
  CPIB: "#0071CE",
  CBIB: "#FCD58A",
  CPPIB: "#CF0F47",
  CPOIB: "#004D40",
  CDOIB: "#4BA38A",
  "Total Izin": "#DC3C22",
};

const darkColors: Record<string, string> = {
  CPIB: "#E1F0FF",
  CBIB: "#FFF2E1",
  CPPIB: "#FFE6EB",
  CPOIB: "#E0F2F1",
  CDOIB: "#E8F5F1",
  "Total Izin": "#FFE6E0",
};

/* ------------------ Props ------------------ */
type ResumeCardProps = {
  rekapIzin?: {
    total?: number;
    CBIB?: number;
    CDOIB?: number;
    CPIB?: number;
    CPOIB?: number;
    CPPIB?: number;
  } | null;
};

/* ------------------ Component ------------------ */
const ResumeCard: React.FC<ResumeCardProps> = ({ rekapIzin }) => {
  const { theme } = useTheme(); // pakai context buatanmu
  const colors = theme === "dark" ? darkColors : lightColors;

  if (!rekapIzin) return null;

  const stats = [
    { label: "CPIB", value: formatNumber(rekapIzin?.CPIB ?? 0) },
    { label: "CBIB", value: formatNumber(rekapIzin?.CBIB ?? 0) },
    { label: "CPPIB", value: formatNumber(rekapIzin?.CPPIB ?? 0) },
    { label: "CPOIB", value: formatNumber(rekapIzin?.CPOIB ?? 0) },
    { label: "CDOIB", value: formatNumber(rekapIzin?.CDOIB ?? 0) },
    { label: "Total Izin", value: formatNumber(rekapIzin?.total ?? 0) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 p-5 md:p-6"
          style={{
            backgroundColor: colors[s.label],
            color: theme === "dark" ? "#111" : "#fff",
          }}
        >
          <span className="text-base font-medium">{s.label}</span>
          <div className="flex items-end justify-end mt-5">
            <h4 className="font-bold text-[25px]">{s.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeCard;