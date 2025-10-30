import { useEffect, useState } from "react";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import ReportService, {
  RekapSKPProvinsi,
} from "@/services/ReportServices";
import DashboardService, {
  ResumeSKPResponse,
  KomposisiPeringkatSKP,
  TopUPISKP, TopProvinsiSKP,
  KomposisiPermohonanSKP,
  DistribusiSkalaUsahaSKP,
  TrenBulananSKP,
  KomposisiOlahanSKP,
  TopKabupatenSKP
} from "@/services/DashboardServices";
import ResumeCard from "./ResumeCard";
import TrenBulananSKPChart from "./TrenBulananSKPChart";
import TabelSKP from "./TabelSKP";
import KomposisiPeringkatSKPChart from "./KomposisiPeringkatSKPChart";
import KomposisiPermohonanSKPChart from "./KomposisiPermohonanSKPChart";
import DistribusiSkalaUsahaChart from "./DistribusiSkalaUsahaChart";
import KomposisiOlahanSKPChart from "./KomposisiOlahanSKPChart";

export const DashboardSKP = () => {
  const { periode } = usePeriode();
  const { user } = useUser();

  const [rekapProvinsi, setRekapProvinsi] = useState<RekapSKPProvinsi[]>([]);

  // Variable state untuk Service Dashboard SKP 
  const [resumeSKP, setResumeSKP] = useState<ResumeSKPResponse | null>(null);
  const [trenBulananSKP, setTrenBulananSKP] = useState<TrenBulananSKP[]>([]);
  const [komposisiPeringkatSKP, setKomposisiPeringkatSKP] = useState<KomposisiPeringkatSKP[]>([]);
  const [topUPISKP, setTopUPISKP] = useState<TopUPISKP[]>([]);
  const [topProvinsiSKP, setTopProvinsiSKP] = useState<TopProvinsiSKP[]>([]);
  const [komposisiPermohonanSKP, setKomposisiPermohonanSKP] = useState<KomposisiPermohonanSKP[]>([]);
  const [distribusiSkalaUsahaSKP, setDistribusiSkalaUsahaSKP] = useState<DistribusiSkalaUsahaSKP[]>([]);
  const [komposisiOlahanSKP, setKomposisiOlahanSKP] = useState<KomposisiOlahanSKP[]>([]);
  const [topKabupatenSKP, setTopKabupatenSKP] = useState<TopKabupatenSKP[]>([]);

  // --- Fetch Resume SKP --- 
  const fetchResumeSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getResumeSKP(startDate, endDate);
      setResumeSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch resume SKP:", err);
      setResumeSKP(null);
    }
  };

  // --- Fetch Tren Bulanan SKP --- 
  const fetchTrenBulananSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getTrenBulananSKP(startDate, endDate);
      setTrenBulananSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch tren bulanan SKP:", err);
      setTrenBulananSKP([]);
    }
  };
  // --- Fetch Komposisi Peringkat SKP --- 
  const fetchKomposisiPeringkatSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getKomposisiPeringkatSKP(startDate, endDate);
      setKomposisiPeringkatSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch komposisi peringkat SKP:", err);
      setKomposisiPeringkatSKP([]);
    }
  };

  // --- Fetch Top UPI SKP --- 
  const fetchTopUPISKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getTopUPISKP(startDate, endDate);
      setTopUPISKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch top UPI SKP:", err); setTopUPISKP([]);
    }
  };

  // --- Fetch Top Provinsi SKP --- 
  const fetchTopProvinsiSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getTopProvinsiSKP(startDate, endDate);
      setTopProvinsiSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch top provinsi SKP:", err);
      setTopProvinsiSKP([]);
    }
  };
  // --- Fetch Komposisi Permohonan SKP --- 
  const fetchKomposisiPermohonanSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getKomposisiPermohonanSKP(startDate, endDate);
      setKomposisiPermohonanSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch komposisi permohonan SKP:", err);
      setKomposisiPermohonanSKP([]);
    }
  };

  // --- Fetch Distribusi Skala Usaha SKP --- 
  const fetchDistribusiSkalaUsahaSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getDistribusiSkalaUsahaSKP(startDate, endDate);
      setDistribusiSkalaUsahaSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch distribusi skala usaha SKP:", err);
      setDistribusiSkalaUsahaSKP([]);
    }
  };
  // --- Fetch Komposisi Olahan SKP --- 
  const fetchKomposisiOlahanSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getKomposisiOlahanSKP(startDate, endDate);
      setKomposisiOlahanSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch komposisi olahan SKP:", err);
      setKomposisiOlahanSKP([]);
    }
  };

  // --- Fetch Top Kabupaten SKP --- 
  const fetchTopKabupatenSKP = async (startDate?: string, endDate?: string) => {
    try {
      const result = await DashboardService.getTopKabupatenSKP(startDate, endDate);
      setTopKabupatenSKP(result);
    } catch (err) {
      console.error("❌ Gagal fetch top kabupaten SKP:", err);
      setTopKabupatenSKP([]);
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
      console.log("Rekap SKP Provinsi:", rows);
    } catch (err) {
      console.error("Gagal fetch rekap SKP:", err);
      setRekapProvinsi([]);
    }
  };

  // --- Fetch data ketika periode, provinsi, page, atau limit berubah ---
  useEffect(() => {
    if (!user || !periode.startDate || !periode.endDate) return;
    fetchResumeSKP(periode.startDate, periode.endDate);
    fetchTrenBulananSKP(periode.startDate, periode.endDate);
    fetchKomposisiPeringkatSKP(periode.startDate, periode.endDate);
    fetchTopUPISKP(periode.startDate, periode.endDate);
    fetchTopProvinsiSKP(periode.startDate, periode.endDate);
    fetchKomposisiPermohonanSKP(periode.startDate, periode.endDate);
    fetchDistribusiSkalaUsahaSKP(periode.startDate, periode.endDate);
    fetchKomposisiOlahanSKP(periode.startDate, periode.endDate);
    fetchTopKabupatenSKP(periode.startDate, periode.endDate);
    fetchRekapSKP(periode.startDate, periode.endDate, 100);
  }, [user, periode.startDate, periode.endDate]);

  /* ------------------ Render ------------------ */
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        {/* Resume Summary */}
        <ResumeCard data={resumeSKP} />
      </div>
      <div className="col-span-12 space-y-6">
        {/* Tren Bulanan */}
        <TrenBulananSKPChart data={trenBulananSKP} />
      </div>
      <div className="col-span-3 space-y-6">
        {/* Komposisi Peringkat */}
        <KomposisiPeringkatSKPChart data={komposisiPeringkatSKP} />
      </div>
      <div className="col-span-3 space-y-6">
        {/* Komposisi Permohonan */}
        <KomposisiPermohonanSKPChart data={komposisiPermohonanSKP} />
      </div>
      <div className="col-span-3 space-y-6">
        {/* Distribusi Skala Usaha */}
        <DistribusiSkalaUsahaChart data={distribusiSkalaUsahaSKP} />
      </div>
      <div className="col-span-3 space-y-6">
        {/* Komposisi Olahan */}
        <KomposisiOlahanSKPChart data={komposisiOlahanSKP} />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-12">
        {/* <ComponentCard title="Dashboard SKP"> */}
        <TabelSKP data={rekapProvinsi} />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
};

export default DashboardSKP;