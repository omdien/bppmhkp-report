"use client";

import { useEffect, useState, useMemo } from "react";
import TabelSMKHP from "@/components/report/ekspor/TabelSMKHP";
import Pagination from "@/components/report/ekspor/Pagination";
import ReportService, { ReportEkspor } from "@/services/ReportServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import DashboardService, { SummaryEkspor } from "@/services/DashboardServices";
import FilterBar from "@/components/report/ekspor/FilterBar";
import { FileSpreadsheet } from "lucide-react";
import { formatNumber, formatNumber2Dec, formatCurrency } from "@/utils/formating";
import { formatPeriodeLaporan } from "@/utils/formatPeriode";

interface FilterValues {
  negara: string;
  upt: string;
  komoditas: string;
}

const INITIAL_FILTERS: FilterValues = { negara: "", upt: "", komoditas: "" };

export default function ReportPage() {
  const { periode } = usePeriode();
  const { user } = useUser();

  const [dataSummary, setDataSummary] = useState<SummaryEkspor | null>(null);
  const [data, setData] = useState<ReportEkspor[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<FilterValues>(INITIAL_FILTERS);

  const labelPeriode = useMemo(() => {
    if (!periode.startDate || !periode.endDate) return "";
    return formatPeriodeLaporan(periode.startDate, periode.endDate);
  }, [periode.startDate, periode.endDate]);

  // Reset ke halaman 1 jika periode atau filter berubah
  useEffect(() => {
    setPage(1);
  }, [periode, filters]);

  // Fetch data utama
  useEffect(() => {

    if (!user || !periode.startDate || !periode.endDate) return;

    fetchSummaryEkspor(user.kd_unit, periode.startDate, periode.endDate, filters);
    fetchEksporReport(user.kd_unit, periode.startDate, periode.endDate, page, limit, filters);
  }, [user, periode, page, limit, filters]);

  // ------------------------------------------------------------------ //

  const fetchSummaryEkspor = async (
    kd_unit: string,
    startDate: string,
    endDate: string,
    filters: FilterValues
  ) => {
    try {
      const result = await DashboardService.getSummaryEkspor(
        kd_unit,
        startDate,
        endDate,
        filters.negara,
        filters.upt,
        filters.komoditas
      );
      setDataSummary(result);
    } catch (err) {
      console.error("Gagal fetch summary ekspor:", err);
    }
  };

  const fetchEksporReport = async (
    kd_unit: string,
    startDate: string,
    endDate: string,
    page: number,
    limit: number,
    filters: FilterValues
  ) => {
    try {
      const result = await ReportService.getEksporReport(
        kd_unit,
        startDate,
        endDate,
        page,
        limit,
        filters.negara,
        filters.upt,
        filters.komoditas
      );
      setData(result.data);
      setTotalPages(result.totalPages);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      console.error("Gagal fetch report ekspor:", err);
    }
  };

  const handleApplyFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
    // setPage(1) sudah ditangani oleh useEffect di atas
  };

  const handleExportExcel = async () => {
    if (!user || !periode.startDate || !periode.endDate) return;
    try {
      setExporting(true);
      const blob = await ReportService.exportEksporReportToExcel(
        user.kd_unit,
        periode.startDate,
        periode.endDate,
        filters.negara,    // ← tambahan
        filters.upt,       // ← tambahan
        filters.komoditas  // ← tambahan
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_smkhp_${user.kd_unit}_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
    } finally {
      setExporting(false);
    }
  };

  // ------------------------------------------------------------------ //

  return (
    <div>
      {/* Header: Judul & Periode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Laporan Penerbitan SMKHP
            {!["00.1", "00.2", "00.3"].includes(user?.kd_unit ?? "") && user?.nm_pendek_baru && (
              <span className="text-gray-500 dark:text-white/50 font-medium ml-2">
                — {user.nm_pendek_baru}
              </span>
            )}
          </h2>
          <span className="text-base md:text-lg font-semibold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
            {labelPeriode}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onApply={handleApplyFilter}
        kdUnit={user?.kd_unit ?? ""}
        activeFilters={filters}
      />

      <div className="w-full space-y-6">
        {/* Summary Badges + Export Button */}
        <div className="flex flex-wrap items-center gap-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="light" color="primary" size="md">Frekuensi</Badge>
            <Badge variant="solid" color="primary" size="md">
              {formatNumber(dataSummary?.jumFreq ?? 0)}
            </Badge>
            <Badge variant="light" color="success" size="md">Volume (Ton)</Badge>
            <Badge variant="solid" color="success" size="md">
              {formatNumber2Dec((dataSummary?.totalVolume ?? 0) / 1000)}
            </Badge>
            <Badge variant="light" color="error" size="md">Nilai IDR (Juta)</Badge>
            <Badge variant="solid" color="error" size="md">
              {formatCurrency((dataSummary?.totalNilaiIDR ?? 0) / 1_000_000, "IDR")}
            </Badge>
            <Badge variant="light" color="info" size="md">Nilai USD (Juta)</Badge>
            <Badge variant="solid" color="info" size="md">
              {formatCurrency((dataSummary?.totalNilaiUSD ?? 0) / 1_000_000, "USD")}
            </Badge>
          </div>

          <div className="ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
              onClick={handleExportExcel}
              disabled={exporting}
              startIcon={
                exporting ? (
                  <svg
                    className="animate-spin h-4 w-4 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )
              }
            >
              {exporting ? "Processing..." : "Export to Excel"}
            </Button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <TabelSMKHP data={data} page={page} limit={limit} />
        </div>

        {/* Pagination */}
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
    </div>
  );
}