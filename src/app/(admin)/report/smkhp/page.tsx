"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TabelSMKHP from "@/components/report/ekspor/TabelSMKHP";
import Pagination from "@/components/report/ekspor/Pagination";
import ReportService, { ReportEkspor } from "@/services/ReportServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import DashboardService, { SummaryEkspor } from "@/services/DashboardServices";
import { FileSpreadsheet } from "lucide-react";

export default function ReportPage() {
  const [dataSummary, setDataSummary] = useState<SummaryEkspor | null>(null);
  const [data, setData] = useState<ReportEkspor[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [exporting, setExporting] = useState(false); // ✅ state loading untuk export

  const { periode } = usePeriode();
  const { user } = useUser();

  // 🔄 Reset ke halaman 1 jika periode berubah
  useEffect(() => {
    setPage(1);
  }, [periode]);

  useEffect(() => {
    if (!user) return;
    if (!periode.startDate || !periode.endDate) return;

    fetchSummaryEkspor(user.kd_unit, periode.startDate, periode.endDate);
    fetchEksporReport(user.kd_unit, periode.startDate, periode.endDate, page, limit);
  }, [user, periode, page, limit]);

  const fetchSummaryEkspor = async (kd_unit: string, startDate: string, endDate: string) => {
    try {
      if (!startDate || !endDate) return;
      const result = await DashboardService.getSummaryEkspor(kd_unit, startDate, endDate);
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
    limit: number
  ) => {
    try {
      if (!startDate || !endDate) return;
      const result = await ReportService.getEksporReport(kd_unit, startDate, endDate, page, limit);

      setData(result.data);
      setTotalPages(result.totalPages); // ✅ backend kasih totalPages
      setTotalRecords(result.totalRecords); // ✅ simpan totalRecords
    } catch (err) {
      console.error("Gagal fetch report ekspor:", err);
    }
  };

  // ✅ Handler untuk Export Excel
  const handleExportExcel = async () => {
    if (!user || !periode.startDate || !periode.endDate) return;

    try {
      setExporting(true); // mulai loading
      const blob = await ReportService.exportEksporReportToExcel(
        user.kd_unit,
        periode.startDate,
        periode.endDate
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_ekspor_${user.kd_unit}_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
    } finally {
      setExporting(false); // selesai loading
    }
  };

  /* ------------------ Helpers ------------------ */
  const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

  const formatNumber2Dec = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatCurrency = (value: number, currency: "IDR" | "USD") =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan SMKHP" />
      <div className="w-full space-y-6">
        {/* --- Summary Badges --- */}
        <div className="flex">
          <div>
            <Badge variant="light" color="primary" size="md">Frekuensi</Badge>
            <Badge variant="solid" color="primary" size="md">
              {formatNumber(dataSummary?.jumFreq ?? 0)}
            </Badge>{" "}
            <Badge variant="light" color="success" size="md">Volume (Ton)</Badge>
            <Badge variant="solid" color="success" size="md">
              {formatNumber2Dec((dataSummary?.totalVolume ?? 0) / 1000)}
            </Badge>{" "}
            <Badge variant="light" color="error" size="md">Nilai IDR (Juta)</Badge>
            <Badge variant="solid" color="error">
              {formatCurrency((dataSummary?.totalNilaiIDR ?? 0) / 1_000_000, "IDR")}
            </Badge>{" "}
            <Badge variant="light" color="info" size="md">Nilai USD (Juta)</Badge>
            <Badge variant="solid" color="info" size="md">
              {formatCurrency((dataSummary?.totalNilaiUSD ?? 0) / 1_000_000, "USD")}
            </Badge>
          </div>

          {/* --- Export Button --- */}
          <div className="jutify-end ml-auto flex space-x-2 align-middle">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
              onClick={handleExportExcel}
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
        </div>

        {/* --- Table --- */}
        <div className="overflow-x-auto">
          <TabelSMKHP data={data} page={page} limit={limit} />
        </div>

        {/* --- Pagination --- */}
        <div className="mt-4 flex justify-center">
          <Pagination
            page={page}
            limit={limit}
            totalRecords={totalRecords}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1); // reset ke halaman 1 kalau ganti limit
            }}
          />
        </div>
      </div>
    </div>
  );
}
