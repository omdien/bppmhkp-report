import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportEkspor } from "@/services/ReportServices";

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  formatter?: (value: unknown, row: T) => React.ReactNode;
};

const columns: Column<ReportEkspor>[] = [
  { key: "nomor_aju", label: "NO AJU" },
  {
    key: "tanggal_aju",
    label: "TGL AJU",
    formatter: (v) =>
      v ? new Date(v as string).toLocaleDateString("id-ID") : "-",
  },
  {
    key: "tanggal_berangkat",
    label: "TGL BRKT",
    formatter: (v) =>
      v ? new Date(v as string).toLocaleDateString("id-ID") : "-",
  },
  { key: "no_hc", label: "NO SMKHP" },
  {
    key: "tanggal_smkhp",
    label: "TGL SMKHP",
    formatter: (v) => {
      if (typeof v === "string" || typeof v === "number" || v instanceof Date) {
        return new Date(v).toLocaleDateString("id-ID");
      }
      return "-";
    },
  },
  { key: "nama_upt", label: "UPT" },
  { key: "nama_trader", label: "TRADER" },
  { key: "alamat_trader", label: "ALAMAT TRADER" },
  { key: "nama_upi", label: "UPI" },
  { key: "alamat_upi", label: "ALAMAT UPI" },
  { key: "nama_partner", label: "PARTNER" },
  { key: "alamat_partner", label: "ALAMAT PARTNER" },
  { key: "ket_bentuk", label: "BENTUK" },
  { key: "pel_asal", label: "PEL. ASAL" },
  { key: "pel_muat", label: "PEL. MUAT" },
  { key: "negara_tujuan", label: "NEGARA TUJUAN" },
  { key: "pel_bongkar", label: "PEL. BONGKAR" },
  { key: "hscode", label: "HS CODE" },
  { key: "kel_ikan", label: "KEL. IKAN" },
  { key: "nm_dagang", label: "NAMA DAGANG" },
  { key: "nm_latin", label: "NAMA LATIN" },
  {
    key: "netto",
    label: "VOLUME (kg)",
    align: "right",
    formatter: (v) =>
      typeof v === "number" ? v.toLocaleString("id-ID") : "-",
  },
  { key: "jumlah", label: "JUMLAH", align: "right" },
  { key: "satuan", label: "SATUAN" },
  {
    key: "nilai_rupiah",
    label: "NILAI RUPIAH",
    align: "right",
    formatter: (v) =>
      typeof v === "number" ? v.toLocaleString("id-ID") : "-",
  },
  { key: "kurs_usd", label: "KURS USD", align: "right" },
  {
    key: "nilai_usd",
    label: "NILAI USD",
    align: "right",
    formatter: (v) =>
      typeof v === "number" ? v.toLocaleString("id-ID") : "-",
  },
  { key: "cara_angkut", label: "CARA ANGKUT" },
  { key: "alat_angkut", label: "ALAT ANGKUT" },
  { key: "voyage", label: "VOYAGE" },
];

interface Props {
  data: ReportEkspor[];
  page: number;
  limit: number;
}

export default function TabelSMKHP({ data, page, limit }: Props) {
  const headerClass =
    "px-5 py-3 font-semibold whitespace-nowrap text-white text-sm";
  const cellClass =
    "px-5 py-3 whitespace-nowrap text-gray-800 dark:text-gray-200 text-sm";

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
                  className={`${headerClass} ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
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
                  className={`${
                    idx % 2 === 0
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
                        className={`${cellClass} ${
                          col.align === "right" ? "text-right" : "text-left"
                        }`}
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
