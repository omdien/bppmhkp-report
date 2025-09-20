// src/components/report/skp/TabelRekapSKP.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface RekapProvinsi {
  provinsi: string;
  jumlah: number;
}

type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  clickable?: boolean;
};

const columns: Column<RekapProvinsi>[] = [
  { key: "provinsi", label: "Provinsi", width: "w-32" },
  { key: "jumlah", label: "Jumlah", align: "right", width: "w-16", clickable: true },
];

interface Props {
  data: RekapProvinsi[];
  page: number;
  limit: number;
  onCellClick?: (provinsi: string) => void;
}

export default function TabelRekapSKP({ data, page, limit, onCellClick }: Props) {
  const headerClass = "px-2 py-2 font-semibold text-white text-xs text-center";
  const cellClass = "px-2 py-2 text-gray-800 dark:text-gray-200 text-xs";

  const quarter = Math.ceil(data.length / 4);
  const dataChunks = [
    data.slice(0, quarter),
    data.slice(quarter, 2 * quarter),
    data.slice(2 * quarter, 3 * quarter),
    data.slice(3 * quarter),
  ];

  const renderTable = (
    tableData: RekapProvinsi[],
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
                className={`${headerClass} ${col.width ?? ""} ${col.align === "right" ? "text-right" : "text-left"
                  }`}
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
                key={`${row.provinsi}-${idx}`}
                className={`${idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-blue-50 dark:hover:bg-gray-700`}
              >
                <TableCell className={`${cellClass} text-center`}>
                  {startIndex + idx + 1}
                </TableCell>

                {columns.map((col) => {
                  const rawValue = row[col.key];
                  if (
                    col.clickable &&
                    col.key === "jumlah" &&
                    typeof rawValue === "number" &&
                    rawValue > 0
                  ) {
                    return (
                      <TableCell
                        key={`${row.provinsi}-${col.key}`}
                        className={`${cellClass} ${col.width ?? ""} ${col.align === "right" ? "text-right" : "text-left"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() => onCellClick?.(row.provinsi)}
                          className="w-full text-right cursor-pointer hover:underline text-blue-600 font-bold"
                        >
                          {rawValue}
                        </button>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`${row.provinsi}-${col.key}`}
                      className={`${cellClass} ${col.width ?? ""} ${col.align === "right" ? "text-right" : "text-left"
                        }`}
                    >
                      {rawValue}
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
      {/* Desktop: 4 tabel */}
      <div className="hidden lg:grid grid-cols-4 gap-3">
        {dataChunks.map((chunk, idx) => (
          <React.Fragment key={`desktop-chunk-${idx}`}>
            {renderTable(
              chunk,
              (page - 1) * limit +
              dataChunks.slice(0, idx).reduce((sum, c) => sum + c.length, 0)
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: 2 tabel */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-3">
        <React.Fragment key="tablet-1">
          {renderTable(dataChunks[0].concat(dataChunks[1]), (page - 1) * limit)}
        </React.Fragment>
        <React.Fragment key="tablet-2">
          {renderTable(
            dataChunks[2].concat(dataChunks[3]),
            (page - 1) * limit + dataChunks[0].length + dataChunks[1].length
          )}
        </React.Fragment>
      </div>

      {/* Mobile: 1 tabel */}
      <div className="block md:hidden">
        <React.Fragment key="mobile">
          {renderTable(data, (page - 1) * limit, columns.length + 1)}
        </React.Fragment>
      </div>
    </>
  );
}
