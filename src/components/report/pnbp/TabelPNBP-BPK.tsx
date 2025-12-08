import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ILaporanPNBPItem } from "@/services/ReportServices";

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  formatter?: (value: unknown, row: T) => React.ReactNode;
};

const columns: Column<ILaporanPNBPItem>[] = [
  { key: "nomor_aju", label: "NO AJU" },
  { key: "nm_pendek", label: "NAMA UPT" },
  { key: "nm_pengirim", label: "PELAKU USAHA" },
  { key: "ekspor", label: "KEGIATAN" },
  { key: "uraian_negara", label: "NEGARA" },
  { key: "no_pnbp", label: "NO PNBP" },

  {
    key: "tgl_pnbp",
    label: "TGL PNBP",
    formatter: (v) =>
      v ? new Date(v as string).toLocaleDateString("id-ID") : "-",
  },

  { key: "kd_tarif", label: "KD TARIF" },
  { key: "nm_tarif", label: "URAIAN TARIF" },

  {
    key: "volume",
    label: "VOLUME",
    align: "right",
    formatter: (v) =>
      v !== null && v !== undefined
        ? Number(v).toLocaleString("id-ID")
        : "-",
  },

  { key: "satuan", label: "SATUAN" },

  {
    key: "tarif",
    label: "TARIF",
    align: "right",
    formatter: (v) =>
      v !== null && v !== undefined
        ? Number(v).toLocaleString("id-ID")
        : "-",
  },

  {
    key: "total_tarif",
    label: "TOTAL",
    align: "right",
    formatter: (v) =>
      v !== null && v !== undefined
        ? Number(v).toLocaleString("id-ID")
        : "-",
  },

  { key: "pp", label: "PP" },
];

interface Props {
  data: ILaporanPNBPItem[];
  page: number;
  limit: number;
}

export default function TabelPNBPBPK({ data, page, limit }: Props) {
  const headerClass =
    "px-5 py-3 font-semibold whitespace-nowrap text-white text-xs";
  const cellClass =
    "px-5 py-3 whitespace-nowrap text-gray-800 dark:text-gray-200 text-xs";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/5">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-max table-auto border-collapse">
          {/* Header */}
          <TableHeader>
            <TableRow className="bg-blue-500 dark:bg-blue-700">
              <TableCell isHeader className={headerClass}>
                #
              </TableCell>

              {columns.map((col) => (
                <TableCell
                  key={col.key as string}
                  isHeader
                  className={`${headerClass} ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={`${idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                    } hover:bg-blue-50 dark:hover:bg-gray-700`}
                >
                  <TableCell className={cellClass}>
                    {(page - 1) * limit + idx + 1}
                  </TableCell>

                  {columns.map((col) => {
                    const rawValue = row[col.key];
                    const value = col.formatter
                      ? col.formatter(rawValue, row)
                      : rawValue;

                    return (
                      <TableCell
                        key={col.key as string}
                        className={`${cellClass} ${col.align === "right" ? "text-right" : "text-left"}`}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={columns.length + 1}
                  className="px-5 py-3 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
