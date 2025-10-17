"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

type PropinsiData = {
  kode_propinsi: string;
  propinsi: string;
  JUMLAH: number;
  CPIB: number;
  CBIB: number;
  CPPIB: number;
  CPOIB: number;
  CBIB_Kapal: number;
  CDOIB: number;
};

const warnaKolom: Record<string, string> = {
  CPIB: "#0071CE",
  CBIB: "#E0AA3E",
  CPPIB: "#CF0F47",
  CPOIB: "#26A69A",
  CBIB_Kapal: "#5CBFA4",
  CDOIB: "#4BA38A",
  JUMLAH: "#DC3C22",
};

const LogoPropinsi = ({
  kode,
  nama,
  size = 32,
}: {
  kode: string;
  nama: string;
  size?: number;
}) => {
  const [src, setSrc] = useState(`/report/images/propinsi/${kode}.png`);
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0 rounded-full bg-gray-50 dark:bg-gray-800 p-1"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={nama}
        fill
        className="object-contain"
        onError={() => setSrc("/report/images/propinsi/default.png")}
        unoptimized
      />
    </div>
  );
};

interface TabelPrimerProps {
  data: PropinsiData[];
}

const TabelPrimer: React.FC<TabelPrimerProps> = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-900/40">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[950px] overflow-y-auto max-h-[500px]">
          <Table>
            {/* Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50/70 dark:bg-gray-800/30 sticky top-0 z-10">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-sm uppercase tracking-wide text-start text-gray-600 dark:text-gray-300"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-sm uppercase tracking-wide text-start text-gray-600 dark:text-gray-300"
                >
                  Propinsi
                </TableCell>

                {Object.keys(warnaKolom).map((key) => (
                  <TableCell
                    key={key}
                    isHeader
                    className={`px-5 py-3 font-semibold text-sm uppercase tracking-wide text-center`}
                  >
                    <span style={{ color: warnaKolom[key] }}>
                      {key.replace("_", " ")}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row, index) => (
                <TableRow key={row.kode_propinsi || index}>
                  <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300 text-center w-[50px]">
                    {index + 1}
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-800 dark:text-gray-100 font-medium">
                    <div className="flex items-center gap-3">
                      <LogoPropinsi kode={row.kode_propinsi} nama={row.propinsi} />
                      <span className="whitespace-nowrap leading-tight text-[15px]">
                        {row.propinsi
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                    </div>
                  </TableCell>

                  {/* Kolom nilai */}
                  {Object.entries(warnaKolom).map(([key, color]) => (
                    <TableCell
                      key={key}
                      className="px-5 py-3 text-center font-medium"
                    >
                      <span style={{ color }}>{row[key as keyof PropinsiData] ?? 0}</span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TabelPrimer;
