import React from "react";

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
  maxWidth = 300,
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400 text-sm">Tidak ada data</p>;
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div
      className={`
        rounded-2xl border px-4 py-4 shadow-sm transition-colors
        bg-white border-gray-200 
        dark:bg-white/[0.03] dark:border-gray-800
      `}
      style={{
        borderColor: warna,
      }}
    >
      <h2
        className="
          text-base font-semibold mb-3 text-center
          text-gray-800 dark:text-white/90
        "
      >
        {title}
      </h2>

      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Label kanan */}
            <div
              className="text-right truncate dark:text-gray-300"
              style={{
                width: "180px",
              }}
              title={toTitleCase(item.label)}
            >
              {toTitleCase(item.label)}
            </div>

            {/* Bar container */}
            <div
              className="
                flex-1 h-4 rounded overflow-hidden 
                bg-gray-200 dark:bg-white/10
              "
              style={{
                maxWidth: `${maxWidth}px`,
              }}
            >
              <div
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: warna,
                  height: "100%",
                }}
              />
            </div>

            {/* Nilai kanan */}
            <div className="w-10 text-left font-medium text-gray-700 dark:text-gray-300">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrafikPrimerKhusus;
