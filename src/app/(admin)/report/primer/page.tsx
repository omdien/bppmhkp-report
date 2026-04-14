"use client";

import { useEffect, useState, useMemo } from "react";
import TabelProvinsiPrimer from "@/components/report/ekspor/TabelProvinsiPrimer";
import TabelRincianPrimer from "@/components/report/ekspor/TabelRincianPrimer";
import TabelRincianKapal from "@/components/report/ekspor/TabelRincianPrimerKapal";
import Pagination from "@/components/report/ekspor/Pagination";
import ReportService, {
  PropinsiIzinPivot,
  RincianReportPrimer,
  CBIBKapal,
} from "@/services/ReportServices";
import DashboardService, {
  RekapIzinPrimerResponse,
} from "@/services/DashboardServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import Button from "@/components/ui/button/Button";
import { FileSpreadsheet } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatPeriodeLaporan } from "@/utils/formatPeriode";

const izinMap: Record<string, string> = {
  "032000000014": "CPPIB",
  "032000000034": "CPIB",
  "032000000019": "CPOIB",
  "032000000033": "CPIB Kapal",
  "032000000036": "CDOIB",
  "032000000068": "CBIB",
};

export default function ReportingPrimer() {
  const { periode } = usePeriode();
  const { user } = useUser();

  const [propinsiData, setPropinsiData] = useState<PropinsiIzinPivot[]>([]);
  const [rekapIzin, setRekapIzin] = useState<RekapIzinPrimerResponse | null>(null);
  const [exporting, setExporting] = useState(false);

  // ----- State Primer -----
  const [rincianData, setRincianData] = useState<RincianReportPrimer[]>([]);
  const [rincianPage, setRincianPage] = useState(1);
  const [rincianLimit, setRincianLimit] = useState(20);
  const [totalPagesPrimer, setTotalPagesPrimer] = useState(0);
  const [totalRecordsPrimer, setTotalRecordsPrimer] = useState(0);

  // ----- State Kapal -----
  const [rincianCBIBKapalData, setRincianCBIBKapalData] = useState<CBIBKapal[]>([]);
  const [rincianKapalPage, setRincianKapalPage] = useState(1);
  const [rincianKapalLimit, setRincianKapalLimit] = useState(20);
  const [totalPagesKapal, setTotalPagesKapal] = useState(0);
  const [totalRecordsKapal, setTotalRecordsKapal] = useState(0);

  // ----- Filter -----
  const [filterKdIzin, setFilterKdIzin] = useState<string | undefined>();
  const [filterKdDaerah, setFilterKdDaerah] = useState<string | undefined>();
  const [filterNamaProvinsi, setFilterNamaProvinsi] = useState<string | undefined>();

  const [viewMode, setViewMode] = useState<"primer" | "kapal" | "both">("both");

  // ----- Fetch Pivot -----
  const fetchPropinsiPivot = async (startDate: string, endDate: string) => {
    try {
      const response: any = await ReportService.getPropinsiIzin(startDate, endDate);
      const result = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      setPropinsiData(result as PropinsiIzinPivot[]);
    } catch (err) {
      console.error("Gagal fetch pivot:", err);
    }
  };

  const fetchRincianReport = async (startDate: string, endDate: string, page: number, limit: number, kdIzin?: string, kdDaerah?: string) => {
    try {
      const result = await ReportService.getRincianReportPrimer(startDate, endDate, undefined, kdIzin, kdDaerah, page, limit);
      setRincianData(result.data);
      setTotalPagesPrimer(result.pagination.totalPages);
      setTotalRecordsPrimer(result.pagination.totalRecords);
    } catch (err) {
      console.error("Gagal fetch rincian primer:", err);
    }
  };

  const fetchRincianReportCBIBKapal = async (startDate: string, endDate: string, page: number, limit: number, provinsi?: string) => {
    try {
      const result = await ReportService.getReportCBIBKapal(startDate, endDate, provinsi, page, limit);
      setRincianCBIBKapalData(result.data);
      setTotalPagesKapal(result.totalPages);
      setTotalRecordsKapal(result.totalRecords);
    } catch (err) {
      console.error("Gagal fetch rincian kapal:", err);
    }
  };

  const fetchRekapIzin = async (startDate: string, endDate: string) => {
    try {
      const result = await DashboardService.getRekapIzinPrimer(startDate, endDate, 1);
      setRekapIzin(result);
    } catch (err) {
      console.error("Gagal fetch rekap:", err);
    }
  };

  // ----- Export Handlers -----
  const handleExportExcelPropinsi = async () => {
    if (!periode.startDate || !periode.endDate) return;
    try {
      setExporting(true);
      const blob = await ReportService.exportPropinsiIzinToExcel(periode.startDate, periode.endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Penerbitan_sertifikasi_primer_per_provinsi_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); } finally { setExporting(false); }
  };

  const handleExportExcel = async () => {
    if (!periode.startDate || !periode.endDate) return;
    try {
      setExporting(true);
      const blob = await ReportService.exportRincianReportPrimerToExcel(periode.startDate, periode.endDate, "50", filterKdIzin, filterKdDaerah);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${getRincianTitle()}_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); } finally { setExporting(false); }
  };

  const handleExportKapal = async () => {
    if (!periode.startDate || !periode.endDate) return;
    try {
      setExporting(true);
      const blob = await ReportService.exportRincianCBIBKapalToExcel(periode.startDate, periode.endDate, filterNamaProvinsi);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rincian_CPIB_Kapal_${filterNamaProvinsi || 'all'}_${periode.startDate}_${periode.endDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); } finally { setExporting(false); }
  };

  const handleResetFilter = () => {
    setFilterKdIzin(undefined);
    setFilterKdDaerah(undefined);
    setFilterNamaProvinsi(undefined);
    setRincianPage(1);
    setRincianKapalPage(1);
    setViewMode("both");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const findNamaProvinsi = (kdPrefix?: string): string | undefined => {
    if (!kdPrefix) return undefined;
    const foundPivot = propinsiData.find((p) => p.kode_propinsi?.toString().startsWith(kdPrefix));
    return foundPivot?.propinsi || foundPivot?.nama_propinsi || kdPrefix;
  };

  const getRincianTitle = () => {
    const izinLabel = filterKdIzin ? izinMap[filterKdIzin] : "";
    const provLabel = filterKdDaerah ? findNamaProvinsi(filterKdDaerah) : "";
    if (izinLabel && provLabel) return `Rincian Laporan ${izinLabel} Provinsi ${provLabel}`;
    return izinLabel ? `Rincian Laporan ${izinLabel}` : provLabel ? `Rincian Laporan Provinsi ${provLabel}` : "Rincian Laporan";
  };

  const getRincianTitleKapal = () => {
    return filterNamaProvinsi ? `Rincian Laporan CPIB Kapal Provinsi ${filterNamaProvinsi}` : "Rincian Laporan CPIB Kapal";
  };

  const scrollToRincian = () => {
    const elem = document.getElementById("rincian-laporan");
    if (elem) {
      const y = elem.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (user && periode.startDate && periode.endDate) {
      fetchPropinsiPivot(periode.startDate, periode.endDate);
      fetchRekapIzin(periode.startDate, periode.endDate);
    }
  }, [user, periode.startDate, periode.endDate]);

  useEffect(() => {
    if (user && periode.startDate && periode.endDate) {
      fetchRincianReport(periode.startDate, periode.endDate, rincianPage, rincianLimit, filterKdIzin, filterKdDaerah);
    }
  }, [user, periode.startDate, periode.endDate, rincianPage, rincianLimit, filterKdIzin, filterKdDaerah]);

  useEffect(() => {
    if (user && periode.startDate && periode.endDate) {
      fetchRincianReportCBIBKapal(periode.startDate, periode.endDate, rincianKapalPage, rincianKapalLimit, filterNamaProvinsi);
    }
  }, [user, periode.startDate, periode.endDate, rincianKapalPage, rincianKapalLimit, filterNamaProvinsi]);

  const labelPeriode = useMemo(() => {
    return periode.startDate && periode.endDate ? formatPeriodeLaporan(periode.startDate, periode.endDate) : "";
  }, [periode.startDate, periode.endDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-col md:flex-row md:items-baseline gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan Penerbitan Sertifikat Mutu Primer Per Provinsi</h2>
          <span className="text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-1.5 rounded-lg border border-blue-100 font-semibold">{labelPeriode}</span>
        </div>
      </div>

      {/* --- REKAP BADGE LENGKAP --- */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="light" color="primary" size="md">Total CPIB</Badge>
          <Badge variant="solid" color="primary" size="md">{(rekapIzin?.rekap?.CPIB ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="success" size="md">Total CBIB</Badge>
          <Badge variant="solid" color="success" size="md">{(rekapIzin?.rekap?.CBIB ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="error" size="md">Total CPPIB</Badge>
          <Badge variant="solid" color="error" size="md">{(rekapIzin?.rekap?.CPPIB ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="info" size="md">Total CPOIB</Badge>
          <Badge variant="solid" color="info" size="md">{(rekapIzin?.rekap?.CPOIB ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="primary" size="md">Total CPIB Kapal</Badge>
          <Badge variant="solid" color="primary" size="md">{(rekapIzin?.rekap?.CBIB_Kapal ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="success" size="md">Total CDOIB</Badge>
          <Badge variant="solid" color="success" size="md">{(rekapIzin?.rekap?.CDOIB ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="error" size="md">Total Terbit</Badge>
          <Badge variant="solid" color="error" size="md">{(rekapIzin?.rekap?.total ?? 0).toLocaleString("id-ID")}</Badge>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-50"
          onClick={handleExportExcelPropinsi}
          disabled={exporting}
          startIcon={!exporting && <FileSpreadsheet className="w-4 h-4" />}
        >
          {exporting ? "Wait..." : "Export ke Excel"}
        </Button>
      </div>

      <TabelProvinsiPrimer
        data={propinsiData}
        page={1}
        limit={10}
        onCellClick={(kdIzin, kodePropinsi, namaProvinsi, colKey) => {
          const kodePrefix = kodePropinsi?.toString().substring(0, 2);
          if (kdIzin) {
            setFilterKdIzin(kdIzin);
            setFilterKdDaerah(kodePrefix);
            if (kdIzin === "032000000033") {
              setFilterNamaProvinsi(namaProvinsi);
              setRincianKapalPage(1); // Reset Hal Kapal
              setViewMode("kapal");
            } else {
              setFilterNamaProvinsi(undefined);
              setRincianPage(1); // Reset Hal Primer
              setViewMode("primer");
            }
          } else if (colKey === "JUMLAH") {
            setFilterKdDaerah(kodePrefix);
            setFilterNamaProvinsi(namaProvinsi);
            setFilterKdIzin(undefined);
            setRincianPage(1);
            setRincianKapalPage(1);
            setViewMode("both");
          }
          setTimeout(scrollToRincian, 100);
        }}
      />

      <div id="rincian-laporan" className="space-y-8 pt-4">
        {viewMode !== "kapal" && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{getRincianTitle()}</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-green-600 border-green-600" onClick={handleExportExcel} disabled={exporting}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetFilter}>Reset Filter</Button>
              </div>
            </div>
            <TabelRincianPrimer data={rincianData} page={rincianPage} limit={rincianLimit} />
            <div className="mt-4 flex justify-center">
              <Pagination
                page={rincianPage} totalPages={totalPagesPrimer} totalRecords={totalRecordsPrimer} limit={rincianLimit}
                onPageChange={(p) => { setRincianPage(p); scrollToRincian(); }}
                onLimitChange={(l) => { setRincianLimit(l); setRincianPage(1); }}
              />
            </div>
          </div>
        )}

        {viewMode !== "primer" && (
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{getRincianTitleKapal()}</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-green-600 border-green-600" onClick={handleExportKapal} disabled={exporting}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetFilter}>Reset Filter</Button>
              </div>
            </div>
            <TabelRincianKapal data={rincianCBIBKapalData} page={rincianKapalPage} limit={rincianKapalLimit} />
            <div className="mt-4 flex justify-center">
              <Pagination
                page={rincianKapalPage} totalPages={totalPagesKapal} totalRecords={totalRecordsKapal} limit={rincianKapalLimit}
                onPageChange={(p) => { setRincianKapalPage(p); scrollToRincian(); }}
                onLimitChange={(l) => { setRincianKapalLimit(l); setRincianKapalPage(1); }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}