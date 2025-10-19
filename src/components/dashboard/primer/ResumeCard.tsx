"use client";

import React from "react";
import {
  FaSeedling, // CBIB
  FaFish, // CPIB
  FaBox, // CPPIB
  FaPills, // CPOIB
  FaShip, // CBIB_KAPAL
  FaTruck, // CDOIB
  FaCertificate, // Total Izin
} from "react-icons/fa";
import { motion } from "framer-motion";
import { IconType } from "react-icons"; // ✅ tipe yang tepat untuk ikon React Icons

/* ------------------ Helpers ------------------ */
const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

/* ------------------ Color Mapping ------------------ */
const warnaIzin: Record<
  string,
  { from: string; to: string; darkFrom?: string; darkTo?: string }
> = {
  CPIB: { from: "#0D8AF5", to: "#005BB5", darkFrom: "#0062B8", darkTo: "#003A73" },
  CBIB: { from: "#FCD58A", to: "#E3A22A", darkFrom: "#E5B550", darkTo: "#B37A09" },
  CPPIB: { from: "#CF0F47", to: "#8A0B2E", darkFrom: "#A40F3A", darkTo: "#650721" },
  CPOIB: { from: "#00695C", to: "#003D33", darkFrom: "#005248", darkTo: "#002821" },
  CBIB_KAPAL: { from: "#00ACC1", to: "#007C91", darkFrom: "#008FA3", darkTo: "#005C6B" },
  CDOIB: { from: "#4BA38A", to: "#2C6E5C", darkFrom: "#3D8570", darkTo: "#1E5142" },
  "Total Izin": { from: "#DC3C22", to: "#A32610", darkFrom: "#B72E15", darkTo: "#7A1A09" },
};

/* ------------------ Icon Mapping ------------------ */
const iconMap: Record<string, IconType> = {
  CPIB: FaFish,
  CBIB: FaSeedling,
  CPPIB: FaBox,
  CPOIB: FaPills,
  CBIB_KAPAL: FaShip,
  CDOIB: FaTruck,
  "Total Izin": FaCertificate,
};

/* ------------------ Deskripsi ------------------ */
const deskripsiMap: Record<string, string> = {
  CPIB: "Cara Pembenihan Ikan yang Baik",
  CBIB: "Cara Budi Daya Ikan yang Baik",
  CPPIB: "Cara Pembuatan Pakan Ikan yang Baik",
  CPOIB: "Cara Pembuatan Obat Ikan yang Baik",
  CBIB_KAPAL: "Cara Penanganan Ikan di Kapal yang Baik",
  CDOIB: "Cara Distribusi Obat Ikan yang Baik",
  "Total Izin": "Total Keseluruhan Sertifikasi Izin",
};

/* ------------------ Tooltip Card ------------------ */
interface TooltipCardProps {
  title: string;
  text: string;
  Icon: IconType; // ✅ Ganti any → IconType
}

const TooltipCard: React.FC<TooltipCardProps> = ({ title, text, Icon }) => (
  <div
    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2
               bg-gray-900/95 text-white px-3 py-2 rounded-lg shadow-lg
               opacity-0 group-hover:opacity-100 transition-opacity duration-200
               pointer-events-none w-max z-20 backdrop-blur-sm"
  >
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-orange-400" />
      <span className="font-semibold text-xs">{title}</span>
    </div>
    <p className="text-[11px] mt-1 text-gray-300 whitespace-nowrap">{text}</p>
  </div>
);

/* ------------------ Main Component ------------------ */
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

const ResumeCard: React.FC<ResumeCardProps> = ({ rekapIzin }) => {
  if (!rekapIzin) return null;

  const total = rekapIzin?.total ?? 0;

  const stats = [
    { label: "CPIB", value: rekapIzin?.CPIB ?? 0 },
    { label: "CBIB", value: rekapIzin?.CBIB ?? 0 },
    { label: "CPPIB", value: rekapIzin?.CPPIB ?? 0 },
    { label: "CPOIB", value: rekapIzin?.CPOIB ?? 0 },
    { label: "CBIB_KAPAL", value: rekapIzin?.CBIB_Kapal ?? 0 },
    { label: "CDOIB", value: rekapIzin?.CDOIB ?? 0 },
    { label: "Total Izin", value: total },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
      {stats.map((s, i) => {
        const warna = warnaIzin[s.label] || { from: "#999", to: "#666" };
        const IconComponent = iconMap[s.label];
        const deskripsi = deskripsiMap[s.label];
        const persen =
          s.label !== "Total Izin" && total > 0
            ? ((s.value / total) * 100).toFixed(1)
            : null;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="relative group">
              <div
                className="relative rounded-2xl p-5 md:p-6 shadow-md 
                           transition-all duration-300 hover:scale-[1.05]
                           flex flex-col justify-between text-white overflow-visible"
                style={
                  {
                    background: `linear-gradient(145deg, var(--from), var(--to))`,
                    "--from": warna.from,
                    "--to": warna.to,
                  } as React.CSSProperties // ✅ tidak pakai any, gunakan CSSProperties
                }
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent blur-md rounded-2xl pointer-events-none" />

                {deskripsi && IconComponent && (
                  <TooltipCard
                    title={s.label.replace("_", " ")}
                    text={deskripsi}
                    Icon={IconComponent}
                  />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <span
                      className={`font-semibold drop-shadow-sm text-center ${s.label === "CBIB_KAPAL"
                          ? "text-sm leading-tight break-words w-[80px]"
                          : "text-base"
                        }`}
                    >
                      {s.label.replace("_", " ")}
                    </span>
                  </div>

                  {persen && (
                    <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md">
                      {persen}%
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-end mt-5 relative z-10">
                  <h4 className="font-bold text-[26px] drop-shadow-sm">
                    {formatNumber(s.value)}
                  </h4>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ResumeCard;
