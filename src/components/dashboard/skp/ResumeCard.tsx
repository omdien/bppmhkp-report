"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaCertificate,
  FaIndustry,
  FaMapMarkedAlt,
  FaCity,
  // IconType,
} from "react-icons/fa";

import { IconType } from "react-icons"; // ✅ ambil dari react-icons langsung

/* ------------------ Helper ------------------ */
const formatNumber = (value: number): string =>
  new Intl.NumberFormat("id-ID").format(value);

/* ------------------ Tipe Data ------------------ */
interface ResumeData {
  sertifikat?: number;
  upi?: number;
  provinsi?: number;
  kabupaten?: number;
}

interface ResumeCardSKPProps {
  data?: ResumeData | null;
}

/* ------------------ Konfigurasi Global ------------------ */
interface CardConfig {
  label: string;
  icon: IconType;
  description: string;
  colors: { from: string; to: string; darkFrom?: string; darkTo?: string };
}

const CARD_CONFIGS: Record<keyof ResumeData, CardConfig> = {
  sertifikat: {
    label: "Sertifikat",
    icon: FaCertificate,
    description: "Jumlah seluruh sertifikat SKP yang telah diterbitkan",
    colors: {
      from: "#2B6CB0",
      to: "#2C5282",
      darkFrom: "#2C5282",
      darkTo: "#1A365D",
    },
  },
  upi: {
    label: "UPI",
    icon: FaIndustry,
    description: "Jumlah Unit Pengolahan Ikan (UPI) bersertifikat",
    colors: {
      from: "#38A169",
      to: "#276749",
      darkFrom: "#2F855A",
      darkTo: "#1C4532",
    },
  },
  provinsi: {
    label: "Provinsi",
    icon: FaMapMarkedAlt,
    description: "Jumlah provinsi tempat UPI bersertifikat berada",
    colors: {
      from: "#D69E2E",
      to: "#975A16",
      darkFrom: "#B7791F",
      darkTo: "#744210",
    },
  },
  kabupaten: {
    label: "Kabupaten",
    icon: FaCity,
    description: "Jumlah kabupaten/kota tempat UPI bersertifikat berada",
    colors: {
      from: "#DD6B20",
      to: "#9C4221",
      darkFrom: "#C05621",
      darkTo: "#7B341E",
    },
  },
};

/* ------------------ Tooltip Card ------------------ */
interface TooltipCardProps {
  title: string;
  text: string;
  Icon: IconType;
}

const TooltipCard: React.FC<TooltipCardProps> = ({ title, text, Icon }) => (
  <div
    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2
               bg-gray-900/95 text-white px-3 py-2 rounded-lg shadow-lg
               opacity-0 group-hover:opacity-100 transition-opacity duration-200
               pointer-events-none w-max z-20 backdrop-blur-sm"
  >
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-yellow-400" />
      <span className="font-semibold text-xs">{title}</span>
    </div>
    <p className="text-[11px] mt-1 text-gray-300 whitespace-nowrap">{text}</p>
  </div>
);

/* ------------------ Komponen Utama ------------------ */
const ResumeCardSKP: React.FC<ResumeCardSKPProps> = ({ data }) => {
  const stats = Object.entries(CARD_CONFIGS).map(([key, config]) => ({
    key: key as keyof ResumeData,
    ...config,
    value: data?.[key as keyof ResumeData] ?? 0,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item, i) => {
        const { label, icon: Icon, description, colors, value } = item;

        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="relative group">
              <div
                className="relative rounded-2xl p-6 shadow-md 
                           transition-all duration-300 hover:scale-[1.05]
                           flex flex-col justify-between text-white"
                style={
                  {
                    background: `linear-gradient(145deg, var(--from), var(--to))`,
                    "--from": colors.from,
                    "--to": colors.to,
                  } as React.CSSProperties
                }
              >
                {/* Hover Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent blur-md rounded-2xl pointer-events-none" />

                {/* Tooltip */}
                <TooltipCard title={label} text={description} Icon={Icon} />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-semibold text-base drop-shadow-sm">
                      {label}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-end mt-5 relative z-10">
                  <h4 className="font-bold text-[26px] drop-shadow-sm">
                    {formatNumber(value)}
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

export default ResumeCardSKP;
