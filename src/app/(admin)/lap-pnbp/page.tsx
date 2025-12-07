"use client";

import { useEffect, useState, useMemo } from "react";
import ReportService, { ILaporanPNBPItem } from "@/services/ReportServices";
import TabelPNBPBPK from "@/components/report/pnbp/TabelPNBP-BPK";
import Pagination from "@/components/report/ekspor/Pagination";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { usePeriode } from "@/context/PeriodeContext";
// import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/button/Button";
import { FileSpreadsheet } from "lucide-react";
import { formatPeriodeLaporan } from "@/utils/formatPeriode";

export default function ReportingPNBP() {
  const [data, setData] = useState<ILaporanPNBPItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const { periode } = usePeriode();
  // const { user } = useUser();

  const [exporting, setExporting] = useState(false);

  // Fetch data paginated
  const fetchLaporanPNBP = async () => {
    if (!periode.startDate || !periode.endDate) return;

    try {
      const result = await ReportService.getLaporanPNBP(
        periode.startDate,
        periode.endDate,
        page,
        limit,
        undefined,
        undefined,
      );

      // Mapping sesuai response baru backend
      setData(result.data || []);

      setTotalPages(result.pagination.totalPages);
      setTotalRecords(result.pagination.total);

    } catch (err) {
      console.error("Gagal fetch laporan PNBP Item:", err);
    }
  };

  // Export Excel tetap pakai endpoint lama
  // Export Excel baru
  const handleExportExcel = async () => {
    if (!periode.startDate || !periode.endDate) return;

    try {
      setExporting(true);

      // pakai endpoint baru /export-excel
      const blob = await ReportService.exportLaporanPNBP(
        periode.startDate,
        periode.endDate,
        undefined, // negara
        undefined  // kd_tarif
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `laporan_pnbp_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
    } finally {
      setExporting(false);
    }
  };

  // Reset page jika periode berubah
  useEffect(() => {
    setPage(1);
  }, [periode]);

  // Fetch jika page/limit/periode berubah
  useEffect(() => {
    fetchLaporanPNBP();
  }, [periode, page, limit]);

  const labelPeriode = useMemo(() => {
    if (!periode.startDate || !periode.endDate) return "";
    return formatPeriodeLaporan(periode.startDate, periode.endDate);
  }, [periode.startDate, periode.endDate]);

  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Laporan PNBP" /> */}
      <PageBreadcrumb pageTitle={`Laporan PNBP`} />

      <div className="flex items-center justify-between mb-4">
        {/* Label Periode (kiri) */}
        <span className="text-lg font-bold text-gray-700">
          {labelPeriode}
        </span>

        {/* Tombol (kanan) */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportExcel}
          className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
          startIcon={
            exporting ? (
              <svg
                className="animate-spin h-4 w-4 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )
          }
          disabled={exporting}
        >
          {exporting ? "Processing..." : "Export to Excel"}
        </Button>
      </div>


      <div className="overflow-x-auto">
        <TabelPNBPBPK data={data} page={page} limit={limit} />
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          limit={limit}
          totalRecords={totalRecords}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
