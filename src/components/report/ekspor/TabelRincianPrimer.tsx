import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RincianReportPrimer } from "@/services/ReportServices";

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  formatter?: (value: unknown, row: T) => React.ReactNode;
};

const columns: Column<RincianReportPrimer>[] = [
  { key: "uraian_propinsi", label: "PROPINSI" },
  { key: "tgl_izin", label: "TGL IZIN", formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-" },
  { key: "id_izin", label: "ID IZIN" },
  { key: "jenis_izin", label: "JENIS IZIN" },
  { key: "kd_izin", label: "KODE IZIN" },
  // { key: "kd_daerah", label: "KODE DAERAH" },
  { key: "nama_izin", label: "NAMA IZIN" },
  { key: "no_izin", label: "NO IZIN" },
  { key: "nib", label: "NIB" },
  { key: "tgl_permohonan", label: "TGL PERMOHONAN", formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-" },
  // { key: "status_checklist", label: "STATUS CHECKLIST" },
  // { key: "sts_aktif", label: "STATUS AKTIF" },
  { key: "komoditas", label: "KOMODITAS" },
  { key: "npwp_perseroan", label: "NPWP" },
  { key: "nama_perseroan", label: "NAMA PERSEROAN" },
  { key: "alamat_perseroan", label: "ALAMAT PERSEROAN" },
  { key: "rt_rw_perseroan", label: "RT/RW" },
  { key: "kelurahan_perseroan", label: "KELURAHAN" },
  { key: "perseroan_daerah_id", label: "DAERAH ID" },
  { key: "kode_pos_perseroan", label: "KODE POS" },
  { key: "nomor_telpon_perseroan", label: "NO TELEPON" },
  { key: "email_perusahaan", label: "EMAIL" },
  { key: "total_sesuai", label: "SESUAI", align: "right" },
  { key: "total_minor", label: "MINOR", align: "right" },
  { key: "total_mayor", label: "MAYOR", align: "right" },
  { key: "total_kritis", label: "KRITIS", align: "right" },
  { key: "total_hasil", label: "HASIL" },
  { key: "keterangan", label: "KETERANGAN" },
];

interface Props {
  data: RincianReportPrimer[];
  page: number;
  limit: number;
}

export default function TabelRincianPrimer({ data, page, limit }: Props) {
  const headerClass =
    "px-2 py-2 font-semibold whitespace-nowrap text-white text-xs";
  const cellClass =
    "px-2 py-2 whitespace-nowrap text-gray-800 dark:text-gray-200 text-xs";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/5 mt-6">
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
                  key={row.idchecklist ?? idx}
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
                        {value ?? "-"}
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
