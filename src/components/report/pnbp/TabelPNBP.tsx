import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ReportPNBPFlat } from "@/services/ReportServices";

type Column<T> = {
    key: keyof T;
    label: string;
    align?: "left" | "right" | "center";
    formatter?: (value: unknown, row: T) => React.ReactNode;
};

const columns: Column<ReportPNBPFlat>[] = [
    { key: "no_bill", label: "NTB" },
    { key: "ntpn", label: "NTPN" },
    { key: "nomor_aju", label: "NO AJU" },
    { key: "nomor_pnbp", label: "NO PNBP" },
    {
        key: "date_payment",
        label: "TGL BAYAR",
        formatter: (v) =>
            v ? new Date(v as string).toLocaleDateString("id-ID") : "-",
    },
    {
        key: "date_pembukuan",
        label: "TGL BUKU",
        formatter: (v) =>
            v ? new Date(v as string).toLocaleDateString("id-ID") : "-",
    },
    { key: "bank_name", label: "NAMA BANK"},
    { key: "nm_wjb_byr", label: "WAJIB BAYAR" },
    { key: "npwp", label: "NPWP" },
    // { key: "kd_upt", label: "UPT" },
    { key: "NM_UNIT", label: "UPT"},
    { key: "kd_tarif", label: "KD TARIF" },
    { key: "kd_akun", label: "KD AKUN" },
    {
        key: "nominal",
        label: "NOMINAL",
        align: "right",
        formatter: (v) =>
            typeof v === "number" ? v.toLocaleString("id-ID") : "-",
    },
    {
        key: "volume",
        label: "VOLUME",
        align: "right",
        formatter: (v) =>
            typeof v === "number" ? v.toLocaleString("id-ID") : "-",
    },
    { key: "satuan", label: "SATUAN" },
    { key: "kd_lokasi", label: "KD LOKASI" },
    { key: "kd_kabkota", label: "KD KAB/KOTA" },
];

interface Props {
    data: ReportPNBPFlat[];
    page: number;
    limit: number;
}

export default function TabelPNBP({ data, page, limit }: Props) {
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
                                                className={`${cellClass} ${col.align === "right" ? "text-right" : "text-left"
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
