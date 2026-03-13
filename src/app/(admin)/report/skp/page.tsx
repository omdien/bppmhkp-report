"use client";

import { useEffect, useState, useRef, useLayoutEffect, useMemo } from "react";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/report/ekspor/Pagination";

import DashboardService, {
  ResumeSKPResponse,
} from "@/services/DashboardServices";
import ReportService, {
  ReportSKP,
  RekapSKPProvinsi,
} from "@/services/ReportServices";
import TabelRekapSKP from "@/components/report/skp/TabelRekapSKP";
import TabelRincianSKP from "@/components/report/skp/TabelRincianSKP";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/button/Button";
import { FileSpreadsheet } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatPeriodeLaporan } from "@/utils/formatPeriode";

export default function ReportingSKP() {
  const { periode } = usePeriode();
  const { user } = useUser();

  const [resumeSKP, setResumeSKP] = useState<ResumeSKPResponse | null>(null);
  const [rekapProvinsi, setRekapProvinsi] = useState<RekapSKPProvinsi[]>([]);
  const [rincianSKP, setRincianSKP] = useState<ReportSKP[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState<string | undefined>(
    undefined
  );

  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rincianPage, setRincianPage] = useState(1);
  const [rincianLimit, setRincianLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exportingRekapProvinsi, setExportingRekapProvinsi] = useState(false);
  const [exportingSKP, setExportingSKP] = useState(false);

  const rincianRef = useRef<HTMLDivElement>(null);

  const fetchResumeSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getResumeSKP(startDate, endDate);
      setResumeSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch resume SKP:", err);
      setResumeSKP(null);
    }
  };

  // --- Fetch Rekap ---
  const fetchRekapSKP = async (
    startDate?: string,
    endDate?: string,
    limit?: number
  ) => {
    try {
      const result = await ReportService.getRekapProvinsi(
        startDate,
        endDate,
        limit
      );

      const rows = Array.isArray(result) ? result : result;
      setRekapProvinsi(rows);
    } catch (err) {
      console.error("Gagal fetch rekap SKP:", err);
      setRekapProvinsi([]);
    }
  };

  // --- Fetch Rincian ---
  const fetchRincianSKP = async (
    startDate: string,
    endDate: string,
    provinsi?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ReportService.getReportSKP(
        startDate,
        endDate,
        provinsi,
        page,
        limit
      );
      setRincianSKP(result.data);
      setTotalRecords(result.totalRecords);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      console.error("Gagal fetch rincian SKP:", err);
      setError("Gagal memuat data SKP");
    } finally {
      setLoading(false);
    }
  };

  // --- Reset page ke 1 kalau periode atau provinsi berubah ---
  useEffect(() => {
    setRincianPage(1);
  }, [periode, selectedProvinsi]);

  // --- Fetch data ketika periode, provinsi, page, atau limit berubah ---
  useEffect(() => {
    if (!user || !periode.startDate || !periode.endDate) return;

    fetchResumeSKP(periode.startDate, periode.endDate);
    fetchRekapSKP(periode.startDate, periode.endDate, 100);
    fetchRincianSKP(
      periode.startDate,
      periode.endDate,
      selectedProvinsi,
      rincianPage,
      rincianLimit
    );
  }, [
    user,
    periode.startDate,
    periode.endDate,
    selectedProvinsi,
    rincianPage,
    rincianLimit,
  ]);

  // --- Scroll ke rincian dengan offset untuk fixed header ---
  useLayoutEffect(() => {
    if (selectedProvinsi && rincianRef.current) {
      const headerOffset = 80; // ganti sesuai tinggi navbar + margin
      const elementPosition = rincianRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [selectedProvinsi]);

  const handleResetFilter = () => {
    setSelectedProvinsi(undefined);
    setRincianPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToRincian = () => {
    const elem = document.getElementById("rincian-laporan");
    const navbarHeight = 80;
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleExportExcelRekapProvinsi = async () => {
    if (!periode.startDate || !periode.endDate) return;

    try {
      setExportingRekapProvinsi(true);

      // panggil service baru
      const blob = await ReportService.getRekapProvinsiToExcel(
        periode.startDate,
        periode.endDate,
        100 // optional, limit record
      );

      // buat URL dan download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rekap_skp_per_provinsi_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel rekap provinsi:", err);
    } finally {
      setExportingRekapProvinsi(false);
    }
  };

  const handleExportExcelSKP = async () => {
    if (!periode.startDate || !periode.endDate) return;

    try {
      setExportingSKP(true);

      // panggil service baru
      const blob = await ReportService.getReportSKPToExcel(
        periode.startDate,
        periode.endDate,
        selectedProvinsi // opsional, sesuai provinsi yang dipilih
      );

      // buat nama file
      let title = "rincian_skp";
      if (selectedProvinsi) {
        title += `_${selectedProvinsi.toLowerCase().replace(/\s+/g, "_")}`;
      }
      const fileName = `${title}_${periode.startDate}_${periode.endDate}.xlsx`;

      // trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Gagal export Excel SKP:", err);
    } finally {
      setExportingSKP(false);
    }
  };

  const labelPeriode = useMemo(() => {
    if (!periode.startDate || !periode.endDate) return "";
    return formatPeriodeLaporan(periode.startDate, periode.endDate);
  }, [periode.startDate, periode.endDate]);

  return (
    <div>
      {/* <PageBreadcrumb pageTitle="Laporan Sertifikasi Kelayakan Pengolahan" /> */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-white/[0.05]">

        {/* Sisi Kiri: Judul & Periode */}
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Laporan Penerbitan Sertifikat Kelayakan Pengolahaan (SKP)
          </h2>
          <span className="text-base md:text-lg font-semibold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
            {labelPeriode}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* Badge Section */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="light" color="primary" size="md">Jumlah SKP Terbit</Badge>
          <Badge variant="solid" color="primary" size="md">
            {(resumeSKP?.sertifikat ?? 0).toLocaleString("id-ID")}
          </Badge>
          <Badge variant="light" color="success" size="md">Jumlah UPI</Badge>
          <Badge variant="solid" color="success" size="md">
            {(resumeSKP?.upi ?? 0).toLocaleString("id-ID")}
          </Badge>
          <Badge variant="light" color="error" size="md">Jumlah Propinsi</Badge>
          <Badge variant="solid" color="error" size="md">
            {(resumeSKP?.provinsi ?? 0).toLocaleString("id-ID")}
          </Badge>
          <Badge variant="light" color="info" size="md">Jumlah Kabupaten</Badge>
          <Badge variant="solid" color="info" size="md">
            {(resumeSKP?.kabupaten ?? 0).toLocaleString("id-ID")}
          </Badge>
        </div>

        {/* Button Section */}
        <div>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
            onClick={handleExportExcelRekapProvinsi}
            startIcon={
              exportingRekapProvinsi ? (
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
            disabled={exportingRekapProvinsi}
          >
            {exportingRekapProvinsi ? "Processing..." : "Export ke Excel"}
          </Button>
        </div>
      </div>

      {/* Tabel Rekap */}
      <TabelRekapSKP
        data={rekapProvinsi}
        page={1}
        limit={10}
        onCellClick={(provinsi) => {
          setSelectedProvinsi(provinsi);
          setRincianPage(1);
        }}
      />

      <div ref={rincianRef} id="rincian-laporan" className="flex items-center mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Rincian SKP {selectedProvinsi}
        </h2>

        <div className="ml-auto flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
            onClick={handleExportExcelSKP}
            disabled={exportingSKP}
            startIcon={
              exportingSKP ? (
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
          >
            {exportingSKP ? "Processing..." : "Export ke Excel"}
          </Button>

          <Button size="sm" variant="outline" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Tabel Rincian */}
      <div id="rincian-section" className="mt-6">
        {loading && <p className="text-gray-500">Memuat data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <TabelRincianSKP
              data={rincianSKP}
              page={rincianPage}
              limit={rincianLimit}
            />
            <div className="mt-4 flex justify-center">
              <Pagination
                page={rincianPage}
                limit={rincianLimit}
                totalRecords={totalRecords}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setRincianPage(newPage);
                  scrollToRincian();
                }}
                onLimitChange={(newLimit) => {
                  setRincianLimit(newLimit);
                  setRincianPage(1);
                  scrollToRincian();
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
