import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ReportEkspor } from "@/services/ReportServices";

type Column<T> = {
  key: keyof T;
  label: string;
  formatter?: (value: unknown, row: T) => React.ReactNode;
};

const columns: Column<ReportEkspor>[] = [
  { key: "nomor_aju", label: "NO AJU" },
  {
    key: "tanggal_aju",
    label: "TGL AJU",
    formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-",
  },
  {
    key: "tanggal_berangkat",
    label: "TGL BRKT",
    formatter: (v) => (v ? new Date(v as string).toLocaleDateString("id-ID") : "-"),
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
    formatter: (v) => {
      if (typeof v === "number") {
        return v.toLocaleString("id-ID");
      }
      return "-";
    },
  },
  { key: "jumlah", label: "JUMLAH" },
  { key: "satuan", label: "SATUAN" },
  {
    key: "nilai_rupiah",
    label: "NILAI RUPIAH",
    formatter: (v) => {
      if (typeof v === "number") {
        return v.toLocaleString("id-ID");
      }
      return "-";
    },
  },
  { key: "kurs_usd", label: "KURS USD" },
  {
    key: "nilai_usd",
    label: "NILAI USD",
    formatter: (v) => {
      if (typeof v === "number") {
        return v.toLocaleString("id-ID");
      }
      return "-";
    },
  },
  { key: "cara_angkut", label: "CARA ANGKUT" },
  { key: "alat_angkut", label: "ALAT ANGKUT" },
  { key: "voyage", label: "VOYAGE" },
];

interface Props {
  data: ReportEkspor[];
}

export default function TabelSMKHP({ data }: Props) {
  const headerClass =
    "px-5 py-3 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap";
  const cellClass = "px-5 py-3 whitespace-nowrap text-gray-800 dark:text-gray-200";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/5">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-max table-auto border-collapse">
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-800/10">
            <TableRow>
              <TableCell isHeader className={headerClass}>
                #
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.key as string} isHeader className={headerClass}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className={cellClass}>{idx + 1}</TableCell>
                  {columns.map((col) => {
                    const value = col.formatter
                      ? col.formatter(row[col.key], row)
                      : row[col.key];
                    return (
                      <TableCell key={col.key as string} className={cellClass}>
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
