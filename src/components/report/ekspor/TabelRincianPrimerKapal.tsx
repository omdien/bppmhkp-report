import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CBIBKapal } from "@/services/ReportServices";

type Column<T> = {
    key: keyof T;
    label: string;
    align?: "left" | "right" | "center";
    formatter?: (value: unknown, row: T) => React.ReactNode;
};

// 🔹 Definisi kolom tabel untuk CBIB Kapal
const columns: Column<CBIBKapal>[] = [
    { key: "nama_provinsi", label: "PROVINSI" },
    { key: "no_cbib", label: "NO CBIB" },
    { key: "nama_kapal", label: "NAMA KAPAL" },
    { key: "nib", label: "NIB" },
    { key: "alamat", label: "ALAMAT" },
    { key: "gt", label: "GT", align: "right" },
    { key: "tipe_kapal", label: "TIPE KAPAL" },
    {
        key: "tgl_awal_inspeksi",
        label: "TGL AWAL INSPEKSI",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    {
        key: "tgl_akhir_inspeksi",
        label: "TGL AKHIR INSPEKSI",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    {
        key: "tgl_laporan",
        label: "TGL LAPORAN",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    { key: "jenis_produk", label: "JENIS PRODUK" },
    { key: "grade_scpib", label: "GRADE" },
    {
        key: "tgl_terbit",
        label: "TGL TERBIT",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    {
        key: "tgl_kadaluarsa",
        label: "TGL KADALUARSA",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    { key: "upt_inspeksi", label: "UPT INSPEKSI" },
    { key: "nama_pelabuhan", label: "PELABUHAN" },
    { key: "nama_pemilik", label: "NAMA PEMILIK" },
    { key: "telepon", label: "TELEPON" },
    { key: "nahkoda_kapal", label: "NAHKODA" },
    { key: "jumlah_abk", label: "JUMLAH ABK", align: "right" },
    { key: "alat_tangkap", label: "ALAT TANGKAP" },
    { key: "daerah_tangkap", label: "DAERAH TANGKAP" },
    { key: "no_siup", label: "NO SIUP" },
    {
        key: "tgl_siup",
        label: "TGL SIUP",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    { key: "no_kbli", label: "NO KBLI" },
    { key: "no_skkp_bkp_nk", label: "NO SKKP" },
    {
        key: "tgl_skkp_bkp_nk",
        label: "TGL SKKP",
        formatter: (v) => v ? new Date(v as string).toLocaleDateString("id-ID") : "-"
    },
    { key: "pj_pusat", label: "PJ PUSAT" },
];

interface Props {
    data: CBIBKapal[];
    page: number;
    limit: number;
}

export default function TabelRincianPrimerKapal({ data, page, limit }: Props) {
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
                        <TableRow className="bg-green-600 dark:bg-green-700">
                            <TableCell isHeader className={headerClass}>
                                #
                            </TableCell>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.key as string}
                                    isHeader
                                    className={`${headerClass} ${col.align === "right" ? "text-right" : "text-left"
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
                                    key={row.id_cbib ?? idx}
                                    className={`${idx % 2 === 0
                                            ? "bg-white dark:bg-gray-900"
                                            : "bg-gray-50 dark:bg-gray-800"
                                        } hover:bg-green-50 dark:hover:bg-gray-700`}
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
                                                className={`${cellClass} ${col.align === "right" ? "text-right" : "text-left"
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
