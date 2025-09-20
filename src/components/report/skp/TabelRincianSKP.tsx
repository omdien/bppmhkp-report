// src/components/report/skp/TabelRincianSKP.tsx
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ReportSKP } from "@/services/ReportServices";

type Column<T> = {
    key: keyof T;
    label: string;
    align?: "left" | "right" | "center";
    formatter?: (value: unknown, row: T) => React.ReactNode;
};

const columns: Column<ReportSKP>[] = [
    { key: "nib", label: "NIB" },
    { key: "nomor_skp", label: "NOMOR SKP" },
    {
        key: "tanggal_terbit",
        label: "TGL TERBIT",
        formatter: (v) => (v ? new Date(v as string).toLocaleDateString("id-ID") : "-"),
    },
    { key: "nama_upi", label: "NAMA UPI" },
    { key: "alamat", label: "ALAMAT" },
    { key: "provinsi", label: "PROVINSI" },
    { key: "kota_kabupaten", label: "KOTA/KABUPATEN" },
    { key: "skala_usaha", label: "SKALA USAHA" },
    { key: "jenis_permohonan", label: "JENIS PERMOHONAN" },
    {
        key: "tanggal_pengajuan",
        label: "TGL PENGAJUAN",
        formatter: (v) => (v ? new Date(v as string).toLocaleDateString("id-ID") : "-"),
    },
    {
        key: "tanggal_rekomendasi",
        label: "TGL REKOMENDASI",
        formatter: (v) => (v ? new Date(v as string).toLocaleDateString("id-ID") : "-"),
    },
    {
        key: "tanggal_kadaluarsa",
        label: "TGL KADALUARSA",
        formatter: (v) => (v ? new Date(v as string).toLocaleDateString("id-ID") : "-"),
    },
    { key: "nama_produk", label: "NAMA PRODUK" },
    { key: "jenis_olahan", label: "JENIS OLAHAN" },
    { key: "peringkat", label: "PERINGKAT" },
];

interface Props {
    data: ReportSKP[];
    page: number;
    limit: number;
}

export default function TabelRincianSKP({ data, page, limit }: Props) {
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
                            data.map((row, idx) => {
                                // penomoran global (nyambung antar page)
                                const nomor = (page - 1) * limit + idx + 1;

                                return (
                                    <TableRow
                                        key={row.id ?? idx}
                                        className={`${idx % 2 === 0
                                                ? "bg-white dark:bg-gray-900"
                                                : "bg-gray-50 dark:bg-gray-800"
                                            } hover:bg-blue-50 dark:hover:bg-gray-700`}
                                    >
                                        <TableCell className={cellClass}>{nomor}</TableCell>
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
                                );
                            })
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
