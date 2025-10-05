"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
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
  const [rekapIzin, setRekapIzin] = useState<RekapIzinPrimerResponse | null>(
    null
  );
  const [exporting, setExporting] = useState(false);

  // ----- State Primer -----
  const [rincianData, setRincianData] = useState<RincianReportPrimer[]>([]);
  const [rincianPage, setRincianPage] = useState(1);
  const [rincianLimit, setRincianLimit] = useState(20);
  const [totalPagesPrimer, setTotalPagesPrimer] = useState(0);
  const [totalRecordsPrimer, setTotalRecordsPrimer] = useState(0);

  // ----- State Kapal -----
  const [rincianCBIBKapalData, setRincianCBIBKapalData] = useState<CBIBKapal[]>(
    []
  );
  const [rincianKapalPage, setRincianKapalPage] = useState(1);
  const [rincianKapalLimit, setRincianKapalLimit] = useState(20);
  const [totalPagesKapal, setTotalPagesKapal] = useState(0);
  const [totalRecordsKapal, setTotalRecordsKapal] = useState(0);

  // ----- Filter -----
  const [filterKdIzin, setFilterKdIzin] = useState<string | undefined>();
  const [filterKdDaerah, setFilterKdDaerah] = useState<string | undefined>();
  const [filterNamaProvinsi, setFilterNamaProvinsi] = useState<
    string | undefined
  >();

  // view mode: primer | kapal | both
  const [viewMode, setViewMode] = useState<"primer" | "kapal" | "both">("both");

  // ----- Fetch Pivot -----
  const fetchPropinsiPivot = async (startDate: string, endDate: string) => {
    try {
      const result = await ReportService.getPropinsiIzin(startDate, endDate);
      setPropinsiData(result);
    } catch (err) {
      console.error("Gagal fetch propinsi pivot:", err);
    }
  };

  // ----- Fetch Rincian Primer -----
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
      setTotalPagesPrimer(result.totalPages);
      setTotalRecordsPrimer(result.totalRecords);
    } catch (err) {
      console.error("Gagal fetch rincian report primer:", err);
    }
  };

  // ----- Fetch Rincian Kapal -----
  const fetchRincianReportCBIBKapal = async (
    startDate: string,
    endDate: string,
    page: number,
    limit: number,
    provinsi?: string
  ) => {
    try {
      const result = await ReportService.getReportCBIBKapal(
        startDate,
        endDate,
        provinsi,
        page,
        limit
      );
      setRincianCBIBKapalData(result.data);
      setTotalPagesKapal(result.totalPages);
      setTotalRecordsKapal(result.totalRecords);
    } catch (err) {
      console.error("Gagal fetch rincian report CBIB Kapal:", err);
    }
  };

  // ----- Fetch Rekap -----
  const fetchRekapIzin = async (startDate: string, endDate: string) => {
    try {
      const result = await DashboardService.getRekapIzinPrimer(
        startDate,
        endDate,
        1
      );
      setRekapIzin(result);
    } catch (err) {
      console.error("Gagal fetch rekap izin:", err);
    }
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

    const foundPivot = propinsiData.find((p: PropinsiIzinPivot) =>
      [p.kode_propinsi].some((c) => c?.toString().startsWith(kdPrefix))
    );

    if (foundPivot)
      return foundPivot.nama_propinsi || foundPivot.propinsi || undefined;

    if (rincianData.length > 0)
      return rincianData[0].uraian_propinsi || kdPrefix;

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

      let title = getRincianTitle()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

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

  const handleExportKapal = async () => {
    if (!periode.startDate || !periode.endDate) return;
    console.log("Export filterNamaProvinsi:", filterNamaProvinsi);
    
    try {
      setExporting(true);
      const blob = await ReportService.exportRincianCBIBKapalToExcel(
        periode.startDate,
        periode.endDate,
        filterNamaProvinsi
      );

      // pakai langsung filterNamaProvinsi
      let title = "rincian_cbib_kapal";
      if (filterNamaProvinsi) {
        title = `rincian_cbib_kapal_provinsi_${filterNamaProvinsi}`
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
      }

      const fileName = `${title}_${periode.startDate}_${periode.endDate}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel kapal:", err);
    } finally {
      setExporting(false);
    }
  };

  // Label Rincian Report Primer (Selain CBIB Kapal)
  const getRincianTitle = (): string => {
    if (!filterKdIzin && !filterKdDaerah) return "Rincian Laporan";
    const izinLabel = filterKdIzin ? izinMap[filterKdIzin] || filterKdIzin : undefined;
    const provLabel = filterKdDaerah ? findNamaProvinsi(filterKdDaerah) : undefined;
    if (izinLabel && provLabel) return `Rincian Laporan ${izinLabel} Provinsi ${provLabel}`;
    if (izinLabel) return `Rincian Laporan ${izinLabel}`;
    if (provLabel) return `Rincian Laporan Provinsi ${provLabel}`;
    return "Rincian Laporan";
  };

  // Label Rincian Report CBIB Kapal
  const getRincianTitleKapal = (): string => {
    if (!filterNamaProvinsi) return "Rincian Laporan CBIB Kapal";
    const ProvProv = filterNamaProvinsi ? filterNamaProvinsi : undefined;
    if (ProvProv) return `Rincian Laporan CBIB Kapal Provinsi ${ProvProv}`;
    return "Rincian Laporan CBIB Kapal";
  };

  const scrollToRincian = () => {
    const elem = document.getElementById("rincian-laporan");
    if (elem) {
      const yOffset = -100; // sesuaikan dengan tinggi navbar
      const y =
        elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // ----- useEffect -----
  useEffect(() => {
    if (!user || !periode.startDate || !periode.endDate) return;
    fetchPropinsiPivot(periode.startDate, periode.endDate);
    fetchRekapIzin(periode.startDate, periode.endDate);
  }, [user, periode.startDate, periode.endDate]);

  useEffect(() => {
    if (!user || !periode.startDate || !periode.endDate) return;
    fetchRincianReport(
      periode.startDate,
      periode.endDate,
      rincianPage,
      rincianLimit,
      filterKdIzin,
      filterKdDaerah
    );
  }, [
    user,
    periode.startDate,
    periode.endDate,
    rincianPage,
    rincianLimit,
    filterKdIzin,
    filterKdDaerah,
  ]);

  useEffect(() => {
    if (!user || !periode.startDate || !periode.endDate) return;
    fetchRincianReportCBIBKapal(
      periode.startDate,
      periode.endDate,
      rincianKapalPage,
      rincianKapalLimit,
      filterNamaProvinsi
    );
  }, [
    user,
    periode.startDate,
    periode.endDate,
    rincianKapalPage,
    rincianKapalLimit,
    filterNamaProvinsi,
  ]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Sertifikasi Mutu Primer Per Provinsi" />

      {/* Badge Rekap */}
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

          <Badge variant="light" color="primary" size="md">Total CBIB Kapal</Badge>
          <Badge variant="solid" color="primary" size="md">{(rekapIzin?.rekap?.CBIB_Kapal ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="success" size="md">Total CDOIB</Badge>
          <Badge variant="solid" color="success" size="md">{(rekapIzin?.rekap?.CDOIB ?? 0).toLocaleString("id-ID")}</Badge>

          <Badge variant="light" color="error" size="md">Total Terbit</Badge>
          <Badge variant="solid" color="error" size="md">{(rekapIzin?.rekap?.total ?? 0).toLocaleString("id-ID")}</Badge>
        </div>

        {/* Export Excel */}
        <div>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50"
            onClick={handleExportExcelPropinsi}
            startIcon={exporting ? (
              <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (<FileSpreadsheet className="w-4 h-4" />)}
            disabled={exporting}
          >
            {exporting ? "Processing..." : "Export ke Excel"}
          </Button>
        </div>
      </div>

      {/* Tabel Provinsi */}
      <TabelProvinsiPrimer
        data={propinsiData}
        page={1}
        limit={10}
        onCellClick={(kdIzin, kodePropinsi, namaProvinsi, colKey) => {
          // 1) Klik kolom izin OSS (kdIzin ada) -> hanya primer
          if (kdIzin) {
            const kodePrefix = kodePropinsi?.toString().substring(0, 2);
            setFilterKdIzin(kdIzin);
            setFilterKdDaerah(kodePrefix);
            setFilterNamaProvinsi(undefined); // clear kapal filter
            setRincianPage(1);
            setViewMode("primer");
            setTimeout(scrollToRincian, 100);
            return;
          }

          // 2) Klik kolom JUMLAH -> tampilkan kedua tabel (both)
          if (colKey === "JUMLAH") {
            const kodePrefix = kodePropinsi?.toString().substring(0, 2);
            setFilterKdDaerah(kodePrefix);
            setFilterNamaProvinsi(namaProvinsi);
            setFilterKdIzin(undefined);
            setRincianPage(1);
            setRincianKapalPage(1);
            setViewMode("both");
            setTimeout(scrollToRincian, 100);
            return;
          }

          // 3) Klik kolom CBIB_Kapal -> hanya kapal
          if (colKey === "CBIB_Kapal") {
            setFilterNamaProvinsi(namaProvinsi);
            setFilterKdIzin(undefined);
            setFilterKdDaerah(undefined);
            setRincianKapalPage(1);
            setViewMode("kapal");
            setTimeout(scrollToRincian, 100);
            return;
          }

          // Fallback: treat as both if we got a kodePropinsi or namaProvinsi
          if (kodePropinsi || namaProvinsi) {
            const kodePrefix = kodePropinsi?.toString().substring(0, 2);
            setFilterKdDaerah(kodePrefix);
            setFilterNamaProvinsi(namaProvinsi);
            setFilterKdIzin(undefined);
            setRincianPage(1);
            setRincianKapalPage(1);
            setViewMode("both");
            setTimeout(scrollToRincian, 100);
            return;
          }
        }}
      />

      {/* Rincian Primer (tampil bila viewMode !== 'kapal') */}
      {viewMode !== "kapal" && (
        <>
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
                startIcon={<FileSpreadsheet className="w-4 h-4" />}
                disabled={exporting}
              >
                {exporting ? "Processing..." : "Export ke Excel"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetFilter}>
                Reset Filter
              </Button>
            </div>
          </div>
          <TabelRincianPrimer
            data={rincianData}
            page={rincianPage}
            limit={rincianLimit}
          />
          <div className="mt-4 flex justify-center">
            <Pagination
              page={rincianPage}
              limit={rincianLimit}
              totalRecords={totalRecordsPrimer}
              totalPages={totalPagesPrimer}
              onPageChange={(newPage) => {
                setRincianPage(newPage)
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

      {/* Rincian Kapal (tampil bila viewMode !== 'primer') */}
      {viewMode !== "primer" && (
        <>
          <div id="rincian-laporan" className="flex items-center mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              {getRincianTitleKapal()}
            </h2>
            <div className="ml-auto flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 disabled:opacity-50 flex items-center gap-2"
                onClick={handleExportKapal}
                startIcon={!exporting ? <FileSpreadsheet className="w-4 h-4" /> : undefined}
                disabled={exporting}
              >
                {exporting ? (
                  <>
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
                    Processing...
                  </>
                ) : (
                  "Export ke Excel"
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetFilter}>
                Reset Filter
              </Button>
            </div>
          </div>
          <TabelRincianKapal
            data={rincianCBIBKapalData}
            page={rincianKapalPage}
            limit={rincianKapalLimit}
          />
          <div className="mt-4 flex justify-center">
            <Pagination
              page={rincianKapalPage}
              limit={rincianKapalLimit}
              totalRecords={totalRecordsKapal}
              totalPages={totalPagesKapal}
              onPageChange={(newPage) => {
                setRincianKapalPage(newPage)
                scrollToRincian();
              }}
              onLimitChange={(newLimit) => {
                setRincianKapalLimit(newLimit);
                setRincianKapalPage(1);
                scrollToRincian();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
