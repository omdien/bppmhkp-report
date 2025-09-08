"use client";
import React, { useEffect, useState } from "react";
import DashboardService, {
  SummaryEkspor,
  EksporBulanan,
  EksporHarian,
} from "@/services/DashboardServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import FrequensiChart from "./FrequensiChart";
import VolumeChart from "./VolumeChart";
import NilaiEksporChart from "./NilaiEksporChart";
import ResumeCard from "./ResumeCard";

/* ------------------ Main Component ------------------ */
export const DashboardEkspor = () => {
  const [data, setData] = useState<SummaryEkspor | null>(null);
  const [dataBulanan, setDataBulanan] = useState<EksporBulanan[]>([]);
  const [dataHarian, setDataHarian] = useState<EksporHarian[]>([]);
  const { periode } = usePeriode(); // ambil periode dari context
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    if (!periode.startDate || !periode.endDate) return;

    fetchSummaryEkspor(
      user.kd_unit,
      periode.startDate,
      periode.endDate,
      setData
    );
    fetchEksporBulanan(
      user.kd_unit,
      periode.startDate,
      periode.endDate,
      setDataBulanan
    );
    fetchEksporHarian(
      user.kd_unit,
      periode.startDate,
      periode.endDate,
      setDataHarian
    );
  }, [periode, user]);

  const fetchSummaryEkspor = async (
    kd_unit: string,
    startDate: string,
    endDate: string,
    setData: (data: SummaryEkspor) => void
  ) => {
    try {
      if (!startDate || !endDate) return;
      const result = await DashboardService.getSummaryEkspor(
        kd_unit,
        startDate,
        endDate
      );
      setData(result);
    } catch (err) {
      console.error("Gagal fetch summary ekspor:", err);
    }
  };

  const fetchEksporBulanan = async (
    kd_unit: string,
    startDate: string,
    endDate: string,
    setData: (data: EksporBulanan[]) => void
  ) => {
    try {
      if (!startDate || !endDate) return;
      const result = await DashboardService.getEksporBulanan(
        kd_unit,
        startDate,
        endDate
      );
      console.log("Hasil Ekspor Bulanan:", result);
      setData(result);
    } catch (err) {
      console.error("Gagal fetch ekspor bulanan:", err);
    }
  };

  const fetchEksporHarian = async (
    kd_unit: string,
    startDate: string,
    endDate: string,
    setData: (data: EksporHarian[]) => void
  ) => {
    try {
      if (!startDate || !endDate) return;
      const result = await DashboardService.getEksporHarian(
        kd_unit,
        startDate,
        endDate
      );
      console.log("Hasil Ekspor Harian:", result);
      setData(result);
    } catch (err) {
      console.error("Gagal fetch ekspor harian:", err);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Resume Card */}
      <div className="col-span-12 space-y-6">
        <ResumeCard data={data} />
      </div>

      {/* Chart bagian tengah */}
      <div className="col-span-12 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          <FrequensiChart
            dataHarian={dataHarian}
            dataBulanan={dataBulanan}
            startDate={periode.startDate}
            endDate={periode.endDate}
          />
          <VolumeChart
            dataHarian={dataHarian}
            dataBulanan={dataBulanan}
            startDate={periode.startDate}
            endDate={periode.endDate}
          />
        </div>
      </div>

      {/* Nilai Ekspor */}
      <div className="col-span-12 space-y-6">
        <NilaiEksporChart
          dataBulanan={dataBulanan}
          dataHarian={dataHarian}
          startDate={periode.startDate}
          endDate={periode.endDate}
        />
      </div>
    </div>
  );
};

export default DashboardEkspor;
