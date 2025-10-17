import React from "react";
import Image from "next/image";

type RekapSKPProvinsi = {
  provinsi_id: string;
  provinsi: string;
  jumlah: number;
};

type Props = {
  data: RekapSKPProvinsi[];
};

const TabelSKP: React.FC<Props> = ({ data }) => {
  if (!data?.length) return <p className="text-gray-500">Tidak ada data</p>;

  // Total seluruh provinsi
  const totalJumlah = data.reduce((acc, curr) => acc + curr.jumlah, 0);

  // Warna berdasarkan proporsi
  const getColorByRatio = (ratio: number) => {
    if (ratio <= 5) return "text-red-600 bg-red-500";
    if (ratio <= 10) return "text-amber-600 bg-amber-500";
    if (ratio <= 20) return "text-green-600 bg-green-500";
    return "text-blue-600 bg-blue-500";
  };

  const formatPercent = (ratio: number) =>
    ratio.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "%";

  // Bagi data menjadi 3 kolom tabel (untuk desktop)
  const chunkSize = Math.ceil(data.length / 3);
  const columns = [
    data.slice(0, chunkSize),
    data.slice(chunkSize, chunkSize * 2),
    data.slice(chunkSize * 2),
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Scroll besar tunggal di luar semua tabel */}
      <div className="overflow-y-auto max-h-[75vh] pr-2">
        {/* Layout 3 kolom di desktop, 1 kolom di mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className="rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-3 py-3 text-center w-[50px]">No</th>
                    <th className="px-4 py-3">Provinsi</th>
                    <th className="px-4 py-3 text-center w-[130px]">
                      Jumlah (%)
                    </th>
                    <th className="px-4 py-3">Distribusi</th>
                  </tr>
                </thead>
                <tbody>
                  {col.map((row, i) => {
                    const globalIndex = colIndex * chunkSize + i;
                    const ratio = (row.jumlah / totalJumlah) * 100;
                    const logoSrc = `/report/images/propinsi/${row.provinsi_id}.png`;
                    const colorClass = getColorByRatio(ratio);
                    const [textColor, barColor] = colorClass.split(" ");

                    return (
                      <tr
                        key={row.provinsi_id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {/* Kolom No */}
                        <td className="text-center py-2">{globalIndex + 1}</td>

                        {/* Kolom Provinsi */}
                        <td className="flex items-center gap-2 py-2 px-4">
                          <div
                            className="relative flex-shrink-0 rounded-full bg-gray-50 dark:bg-gray-800 p-1"
                            style={{ width: 32, height: 32 }}
                          >
                            <Image
                              src={logoSrc}
                              alt={row.provinsi}
                              fill
                              className="object-contain"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "/report/images/propinsi/default.png")
                              }
                              unoptimized
                            />
                          </div>
                          <span
                            className="font-medium line-clamp-3 leading-snug break-words"
                            style={{ maxWidth: "160px" }}
                          >
                            {row.provinsi
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                          </span>
                        </td>

                        {/* Kolom Jumlah + Persen */}
                        <td className="text-center font-semibold">
                          <div className="flex flex-col items-center leading-tight">
                            <span className="text-gray-900 dark:text-white">
                              {row.jumlah.toLocaleString("id-ID")}
                            </span>
                            <span
                              className={`text-[11px] font-semibold ${textColor}`}
                            >
                              {formatPercent(ratio)}
                            </span>
                          </div>
                        </td>

                        {/* Kolom Distribusi (bar saja) */}
                        <td className="px-4 py-2">
                          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-4 rounded-full transition-all duration-700 ${barColor}`}
                              style={{ width: `${ratio}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabelSKP;
