"use client";

import React from "react";

/* ------------------ Helpers ------------------ */
const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

/* ------------------ Color Mapping ------------------ */
const warnaIzin: Record<string, string> = {
  CPIB: "#0071CE",
  CBIB: "#FCD58A",
  CPPIB: "#CF0F47",
  CPOIB: "#004D40",
  CBIB_KAPAL: "#00ACC1",
  CDOIB: "#4BA38A",
  "Total Izin": "#DC3C22",
};

/* ------------------ Props ------------------ */
type ResumeCardProps = {
  rekapIzin?: {
    total?: number;
    CBIB?: number;
    CDOIB?: number;
    CPIB?: number;
    CPOIB?: number;
    CBIB_Kapal?: number;
    CPPIB?: number;
  } | null;
};

/* ------------------ Component ------------------ */
const ResumeCard: React.FC<ResumeCardProps> = ({ rekapIzin }) => {
  if (!rekapIzin) return null;

  const stats = [
    { label: "CPIB", value: formatNumber(rekapIzin?.CPIB ?? 0) },
    { label: "CBIB", value: formatNumber(rekapIzin?.CBIB ?? 0) },
    { label: "CPPIB", value: formatNumber(rekapIzin?.CPPIB ?? 0) },
    { label: "CPOIB", value: formatNumber(rekapIzin?.CPOIB ?? 0) },
    { label: "CBIB_KAPAL", value: formatNumber(rekapIzin?.CBIB_Kapal ?? 0) },
    { label: "CDOIB", value: formatNumber(rekapIzin?.CDOIB ?? 0) },
    { label: "Total Izin", value: formatNumber(rekapIzin?.total ?? 0) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-7 md:gap-6">
      {stats.map((s, i) => {
        const baseColor = warnaIzin[s.label] || "#ccc";
        return (
          <div
            key={i}
            className={`
              rounded-2xl border p-5 md:p-6 shadow-sm
              transition-all duration-200
              hover:scale-[1.02]
              dark:border-white/10
            `}
            style={{
              backgroundColor: baseColor,
              borderColor: baseColor,
              color: "#fff",
            }}
          >
            <span className="text-base font-medium drop-shadow-sm">
              {s.label}
            </span>
            <div className="flex items-end justify-end mt-5">
              <h4 className="font-bold text-[25px] drop-shadow-sm">{s.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeCard;
