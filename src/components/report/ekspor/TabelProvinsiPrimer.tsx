import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropinsiIzinPivot } from "@/services/ReportServices";

// 🔑 mapping key → kode izin backend
const izinMapping: Record<string, string | undefined> = {
  CPPIB: "032000000014",
  CPIB: "032000000034",
  CPOIB: "032000000019",
  "CBIB Kapal": "032000000033",
  CDOIB: "032000000036",
  CBIB: "032000000068",
  JUMLAH: undefined,
};

type Column<T> = {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  formatter?: (value: unknown, row: T) => React.ReactNode;
  clickable?: boolean;
};

const columns: Column<PropinsiIzinPivot>[] = [
  { key: "propinsi", label: "Propinsi", width: "w-40" },
  { key: "CPPIB", label: "CPPIB", align: "right", width: "w-14", clickable: true },
  { key: "CPIB", label: "CPIB", align: "right", width: "w-14", clickable: true },
  { key: "CPOIB", label: "CPOIB", align: "right", width: "w-14", clickable: true },
  { key: "CBIB Kapal", label: "CBIB Kapal", align: "right", width: "w-16", clickable: true },
  { key: "CDOIB", label: "CDOIB", align: "right", width: "w-14", clickable: true },
  { key: "CBIB", label: "CBIB", align: "right", width: "w-14", clickable: true },
  { key: "JUMLAH", label: "JUMLAH", align: "right", width: "w-16", clickable: true },
];

interface Props {
  data: PropinsiIzinPivot[];
  page: number;
  limit: number;
  onCellClick?: (kdIzin?: string, kodePropinsi?: string) => void;
}

export default function TabelProvinsiPrimer({ data, page, limit, onCellClick }: Props) {
  const headerClass = "px-2 py-2 font-semibold text-white text-xs text-center";
  const cellClass = "px-2 py-2 text-gray-800 dark:text-gray-200 text-xs";

  const mid = Math.ceil(data.length / 2);
  const leftData = data.slice(0, mid);
  const rightData = data.slice(mid);

  const renderTable = (
    tableData: PropinsiIzinPivot[],
    startIndex: number,
    colSpan?: number
  ) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/5">
      <Table className="table-fixed border-collapse w-full text-xs">
        {/* Header */}
        <TableHeader>
          <TableRow className="bg-blue-500 dark:bg-blue-700">
            <TableCell isHeader className={`${headerClass} w-8`}>#</TableCell>
            {columns.map((col) => (
              <TableCell
                key={col.key as string}
                isHeader
                className={`${headerClass} ${col.width ?? ""} ${
                  col.align === "right" ? "text-right" : "text-left"
                } whitespace-normal break-words`}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow
                key={idx}
                className={`${
                  idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                } hover:bg-blue-50 dark:hover:bg-gray-700`}
              >
                <TableCell className={`${cellClass} text-center`}>
                  {startIndex + idx + 1}
                </TableCell>

                {columns.map((col) => {
                  const rawValue = row[col.key as keyof PropinsiIzinPivot];
                  const value = col.formatter ? col.formatter(rawValue, row) : rawValue;

                  if (col.clickable) {
                    const isClickable = Number(rawValue) > 0;
                    if (isClickable) {
                      return (
                        <TableCell
                          key={col.key as string}
                          className={`${cellClass} ${col.width ?? ""} ${
                            col.align === "right" ? "text-right" : "text-left"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const kdIzin = izinMapping[col.key as string];
                              onCellClick?.(kdIzin, row.kode_propinsi);
                            }}
                            className="w-full text-right cursor-pointer hover:underline text-blue-600 font-bold"
                          >
                            {value}
                          </button>
                        </TableCell>
                      );
                    }
                  }

                  return (
                    <TableCell
                      key={col.key as string}
                      className={`${cellClass} ${col.width ?? ""} ${
                        col.align === "right" ? "text-right" : "text-left"
                      } break-words`}
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
                colSpan={colSpan ?? columns.length + 1}
                className="px-2 py-2 text-center text-gray-500 dark:text-gray-400 text-xs"
              >
                Tidak ada data
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {/* Desktop: 2 tabel */}
      <div className="hidden md:grid grid-cols-2 gap-3">
        {renderTable(leftData, (page - 1) * limit)}
        {renderTable(rightData, (page - 1) * limit + leftData.length)}
      </div>

      {/* Mobile: 1 tabel */}
      <div className="block md:hidden">
        {renderTable(data, (page - 1) * limit, columns.length + 1)}
      </div>
    </>
  );
}
