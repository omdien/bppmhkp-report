"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TabelProvinsiPrimer from "@/components/report/ekspor/TabelProvinsiPrimer";
import TabelRincianPrimer from "@/components/report/ekspor/TabelRincianPrimer";
import Pagination from "@/components/report/ekspor/Pagination";
import ReportService, { PropinsiIzinPivot, RincianReportPrimer } from "@/services/ReportServices";
import DashboardService, { RekapIzinPrimerResponse } from "@/services/DashboardServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/button/Button";
import { FileSpreadsheet, ArrowUp } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

// mapping kdIzin → label singkat
const izinMap: Record<string, string> = {
  "032000000014": "CPPIB",
  "032000000034": "CPIB",
  "032000000019": "CPOIB",
  "032000000033": "CBIB Kapal",
  "032000000036": "CDOIB",
  "032000000068": "CBIB",
};

export default function ReportingPrimer() {
  const { periode } = usePeriode();
  const { user } = useUser();

  const [propinsiData, setPropinsiData] = useState<PropinsiIzinPivot[]>([]);
  const [rincianData, setRincianData] = useState<RincianReportPrimer[]>([]);
  const [rincianPage, setRincianPage] = useState(1);
  const [rincianLimit, setRincianLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterKdIzin, setFilterKdIzin] = useState<string | undefined>();
  const [filterKdDaerah, setFilterKdDaerah] = useState<string | undefined>();
  const [exporting, setExporting] = useState(false);
  const [rekapIzin, setRekapIzin] = useState<RekapIzinPrimerResponse | null>(null);

  // ----- Fetch Pivot -----
  const fetchPropinsiPivot = async (startDate: string, endDate: string) => {
    try {
      const result = await ReportService.getPropinsiIzin(startDate, endDate);
      setPropinsiData(result);
    } catch (err) {
      console.error("Gagal fetch propinsi pivot:", err);
    }
  };

  // ----- Fetch Rincian -----
  const fetchRincianReport = async (
    startDate: string,
    endDate: string,
    page: number,
    limit: number,
    kdIzin?: string,
    kdDaerah?: string
  ) => {
    try {
      const result = await ReportService.getRincianReportPrimer(
        startDate,
        endDate,
        "50",
        kdIzin,
        kdDaerah,
        page,
        limit
      );
      setRincianData(result.data);
      setTotalPages(result.totalPages);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      console.error("Gagal fetch rincian report primer:", err);
    }
  };

  const fetchRekapIzin = async (
    startDate: string,
    endDate: string
  ) => {
    try {
      const result = await DashboardService.getRekapIzinPrimer(
        startDate,
        endDate,
        1
      );
      setRekapIzin(result);
      console.log("Rekap Izin Primer:", result);
    } catch (err) {
      console.error("Gagal fetch rekap izin:", err);
    }
  };

  const handleResetFilter = () => {
    setFilterKdIzin(undefined);
    setFilterKdDaerah(undefined);
    setRincianPage(1);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const findNamaProvinsi = (kdPrefix?: string): string | undefined => {
    if (!kdPrefix) return undefined;

    const foundPivot = propinsiData.find((p: PropinsiIzinPivot) =>
      [p.kode_propinsi].some((c) => c?.toString().startsWith(kdPrefix))
    );

    if (foundPivot) return foundPivot.nama_propinsi || foundPivot.propinsi || undefined;

    if (rincianData.length > 0) return rincianData[0].uraian_propinsi || kdPrefix;

    return kdPrefix;
  };

  const handleExportExcelPropinsi = async () => {
    if (!periode.startDate || !periode.endDate) return;

    try {
      setExporting(true);
      const blob = await ReportService.exportPropinsiIzinToExcel(
        periode.startDate,
        periode.endDate
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan_sertifikasi_mutu_primer_per_provinsi_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel propinsi izin:", err);
    } finally {
      setExporting(false);
    }
  };

  // ----- Export Excel Handler -----
  const handleExportExcel = async () => {
    if (!periode.startDate || !periode.endDate) return;

    try {
      setExporting(true);
      const blob = await ReportService.exportRincianReportPrimerToExcel(
        periode.startDate,
        periode.endDate,
        "50",
        filterKdIzin,
        filterKdDaerah
      );

      // ambil title dari fungsi yang sudah ada
      let title = getRincianTitle()
        .toLowerCase()
        .replace(/\s+/g, "_")       // spasi → underscore
        .replace(/[^a-z0-9_]/g, ""); // hapus karakter aneh

      if (!title) title = "rincian_laporan";

      const fileName = `${title}_${periode.startDate}_${periode.endDate}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
    } finally {
      setExporting(false);
    }
  };

  const getRincianTitle = (): string => {
    if (!filterKdIzin && !filterKdDaerah) return "Rincian Laporan";
    const izinLabel = filterKdIzin ? izinMap[filterKdIzin] || filterKdIzin : undefined;
    const provLabel = filterKdDaerah ? findNamaProvinsi(filterKdDaerah) : undefined;
    if (izinLabel && provLabel) return `Rincian Laporan ${izinLabel} Provinsi ${provLabel}`;
    if (izinLabel) return `Rincian Laporan ${izinLabel}`;
    if (provLabel) return `Rincian Laporan Provinsi ${provLabel}`;
    return "Rincian Laporan";
  };

  const scrollToRincian = () => {
    const elem = document.getElementById("rincian-laporan");
    elem?.scrollIntoView({ behavior: "smooth" });
  };
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ----- useEffect fetch data -----
  useEffect(() => {
    if (!user || !periode.startDate || !periode.endDate) return;

    fetchPropinsiPivot(periode.startDate, periode.endDate);
    fetchRincianReport(
      periode.startDate,
      periode.endDate,
      rincianPage,
      rincianLimit,
      filterKdIzin,
      filterKdDaerah
    );
    fetchRekapIzin(periode.startDate, periode.endDate);
  }, [user, periode.startDate, periode.endDate, rincianPage, rincianLimit, filterKdIzin, filterKdDaerah]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Sertifikasi Mutu Primer Per Provinsi" />
      <div className="flex justify-between items-center mb-4">
        {/* Badge Section */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="light" color="primary" size="md">Total CPIB</Badge>
          <Badge variant="solid" color="primary" size="md">
            {(rekapIzin?.rekap?.CPIB ?? 0).toLocaleString("id-ID")}
          </Badge>

          <Badge variant="light" color="success" size="md">Total CBIB</Badge>
          <Badge variant="solid" color="success" size="md">
            {(rekapIzin?.rekap?.CBIB ?? 0).toLocaleString("id-ID")}
          </Badge>

          <Badge variant="light" color="error" size="md">Total CPPIB</Badge>
          <Badge variant="solid" color="error" size="md">
            {(rekapIzin?.rekap?.CPPIB ?? 0).toLocaleString("id-ID")}
          </Badge>

          <Badge variant="light" color="info" size="md">Total CPOIB</Badge>
          <Badge variant="solid" color="info" size="md">
            {(rekapIzin?.rekap?.CPOIB ?? 0).toLocaleString("id-ID")}
          </Badge>

          <Badge variant="light" color="primary" size="md">Total CDOIB</Badge>
          <Badge variant="solid" color="primary" size="md">
            {(rekapIzin?.rekap?.CDOIB ?? 0).toLocaleString("id-ID")}
          </Badge>

          <Badge variant="light" color="success" size="md">Total Terbit</Badge>
          <Badge variant="solid" color="success" size="md">
            {(rekapIzin?.rekap?.total ?? 0).toLocaleString("id-ID")}
          </Badge>
        </div>

        {/* Button Section */}
        <div>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
            onClick={handleExportExcelPropinsi}
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
            {exporting ? "Processing..." : "Export ke Excel"}
          </Button>
        </div>
      </div>


      <TabelProvinsiPrimer
        data={propinsiData}
        page={1}
        limit={10}
        onCellClick={(kdIzin, kodePropinsiRaw) => {
          const kodePrefix = kodePropinsiRaw?.toString().substring(0, 2);
          setFilterKdIzin(kdIzin);
          setFilterKdDaerah(kodePrefix);
          setRincianPage(1);
          setTimeout(scrollToRincian, 100);
        }}
      />

      <div id="rincian-laporan" className="flex items-center mt-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {getRincianTitle()}
        </h2>

        <div className="ml-auto flex space-x-2">
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
            {exporting ? "Processing..." : "Export ke Excel"}
          </Button>

          <Button size="sm" variant="outline" onClick={handleResetFilter}>
            Reset Filter
          </Button>

          <Button size="sm" variant="outline" onClick={scrollToTop}>
            <ArrowUp className="w-4 h-4 mr-2" />
            Kembali ke Atas
          </Button>
        </div>
      </div>

      <TabelRincianPrimer data={rincianData} page={rincianPage} limit={rincianLimit} />

      <div className="mt-4 flex justify-center">
        <Pagination
          page={rincianPage}
          limit={rincianLimit}
          totalRecords={totalRecords}
          totalPages={totalPages}
          onPageChange={(newPage) => setRincianPage(newPage)}
          onLimitChange={(newLimit) => {
            setRincianLimit(newLimit);
            setRincianPage(1);
          }}
        />
      </div>
    </div>
  );
}
