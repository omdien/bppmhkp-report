"use client";

import { useEffect, useState } from "react";
import ReportService, { ReportPNBPFlat, ReportPNBPSummary } from "@/services/ReportServices";
import TabelPNBP from "@/components/report/pnbp/TabelPNBP";
import Pagination from "@/components/report/ekspor/Pagination";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/button/Button";
import { FileSpreadsheet } from "lucide-react";
import Radio from "@/components/form/input/Radio";
import Badge from "@/components/ui/badge/Badge";
import { formatCurrency, formatNumber } from "@/utils/formating";

export default function ReportingPNBP() {
  const [dataPNBPFlat, setDataPNBPFlat] = useState<ReportPNBPFlat[]>([]);
  const [dataSummary, setDataSummary] = useState<ReportPNBPSummary | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { periode } = usePeriode();
  const { user } = useUser();

  const [exporting, setExporting] = useState(false);
  const [selectedValue, setSelectedValue] = useState<"datePayment" | "dateBook">("datePayment");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value as "datePayment" | "dateBook");
  };

  const fetchPNBPFlat = async (
    filterType: "datePayment" | "dateBook",
    startDate: string,
    endDate: string,
    idUPT: string,
    page: number,
    limit: number
  ) => {
    try {
      const result = await ReportService.getReportPNBPFlat(
        filterType,
        startDate,
        endDate,
        idUPT,
        page,
        limit
      );
      setDataPNBPFlat(result.data);
      setTotalPages(result.totalPages);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      console.error("Gagal fetch PNBP Flat:", err);
    }
  };

  const fetchReportPNBPSummary = async (
    filterType: "datePayment" | "dateBook",
    startDate: string,
    endDate: string,
    idUPT: string
  ) => {
    try {
      const result = await ReportService.getReportPNBPSummary(
        filterType,
        startDate,
        endDate,
        idUPT
      );
      setDataSummary(result);
    } catch (err) {
      console.error("Gagal fetch PNBP Summary:", err);
    }
  };

  // ✅ Handler Export Excel
  const handleExportExcel = async () => {
    if (!user || !periode.startDate || !periode.endDate) return;

    try {
      setExporting(true);
      const blob = await ReportService.getReportPNBPFlatToExcell(
        selectedValue,
        periode.startDate,
        periode.endDate,
        user.kd_unit
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_pnbp_${user.kd_unit}_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [periode]);

  useEffect(() => {
    if (!user) return;
    if (!periode.startDate || !periode.endDate) return;
    fetchPNBPFlat(selectedValue, periode.startDate, periode.endDate, user.kd_unit, page, limit);
    fetchReportPNBPSummary(selectedValue, periode.startDate, periode.endDate, user.kd_unit);
  }, [user, periode, page, limit, selectedValue]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan PNBP" />

      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between">
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <div className="font-medium text-sm text-gray-800 dark:text-white/90">
              Filter berdasarkan
            </div>
            <Radio
              id="radio1"
              name="group1"
              value="datePayment"
              checked={selectedValue === "datePayment"}
              onChange={handleRadioChange}
              label="Tanggal Bayar"
            />
            <Radio
              id="radio2"
              name="group1"
              value="dateBook"
              checked={selectedValue === "dateBook"}
              onChange={handleRadioChange}
              label="Tanggal Buku"
            />
          </div>

          {/* Export Button */}
          <div className="jutify-end ml-auto flex space-x-2 align-middle">
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
        </div>

        {/* Summary badges */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto">
          <Badge variant="light" color="primary">Jumlah NTB/NTPN</Badge>
          <Badge variant="solid" color="primary">
            {formatNumber(dataSummary?.totalBill ?? 0)}
          </Badge>
          <Badge variant="light" color="success">Jumlah AJU/PNBP</Badge>
          <Badge variant="solid" color="success">
            {formatNumber(dataSummary?.totalNomorAju ?? 0)}
          </Badge>
          <Badge variant="light" color="error">Jumlah Nilai</Badge>
          <Badge variant="solid" color="error">
            {formatCurrency(dataSummary?.totalNominal ?? 0, "IDR")}
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <TabelPNBP data={dataPNBPFlat} page={page} limit={limit} />
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
  );
}
