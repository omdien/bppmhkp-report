"use client";
import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export type GenericBarItem = {
  label: string;
  value: number;
};

type GrafikPrimerKhususProps = {
  data: GenericBarItem[];
  title?: string;
  warna?: string;
  maxWidth?: number;
};

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const GrafikPrimerKhusus: React.FC<GrafikPrimerKhususProps> = ({
  data,
  title = "Grafik Sertifikasi per Provinsi",
  warna = "#1E7E68",
  maxWidth = 360,
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-sm italic text-center">
        Tidak ada data
      </p>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div
      className={`
        rounded-2xl border shadow-sm transition-all duration-300
        bg-white/90 dark:bg-transparent
        border-gray-200 dark:border-white/10
        p-6
      `}
      style={{
        borderColor: warna,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <BarChart3
          size={22}
          strokeWidth={2}
          color={warna}
          className="drop-shadow-sm"
        />
        <h2
          className="text-base md:text-lg font-semibold tracking-wide text-gray-800 dark:text-white/90"
          style={{ color: warna }}
        >
          {title}
        </h2>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 group"
            title={toTitleCase(item.label)}
          >
            {/* Label kiri */}
            <div
              className="text-right truncate text-sm md:text-base font-medium w-[160px]
                         text-gray-700 dark:text-gray-300"
            >
              {toTitleCase(item.label)}
            </div>

            {/* Bar container */}
            <div
              className="flex-1 h-4 rounded-xl overflow-hidden bg-gray-200 dark:bg-white/10 relative"
              style={{ maxWidth: `${maxWidth}px` }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  backgroundColor: warna,
                  height: "100%",
                }}
                className="rounded-xl"
              />
            </div>

            {/* Nilai kanan */}
            <div className="w-12 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrafikPrimerKhusus;
