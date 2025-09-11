"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TabelSMKHP from "@/components/report/ekspor/TabelSMKHP";
import Pagination from "@/components/report/ekspor/Pagination";
import ReportService, { ReportEkspor } from "@/services/ReportServices";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";

export default function ReportPage() {
  const [data, setData] = useState<ReportEkspor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const { periode } = usePeriode();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    if (!periode.startDate || !periode.endDate) return;

    fetchEksporReport(
      user.kd_unit,
      periode.startDate,
      periode.endDate,
      page,
      limit,
      setData,
      setTotalPages
    );
  }, [user, periode, page]);

  const fetchEksporReport = async (
    kd_unit: string,
    startDate: string,
    endDate: string,
    page: number,
    limit: number,
    setData: (data: ReportEkspor[]) => void,
    setTotalPages: (pages: number) => void
  ) => {
    try {
      if (!startDate || !endDate) return;
      const result = await ReportService.getEksporReport(
        kd_unit,
        startDate,
        endDate,
        page,
        limit
      );

      setData(result.data);
      setTotalPages(Math.ceil(result.total / limit));
    } catch (err) {
      console.error("Gagal fetch report ekspor:", err);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan SMKHP" />
      <div className="w-full space-y-6">
        <ComponentCard title="Data Ekspor">
          <div className="overflow-x-auto">
            <TabelSMKHP data={data} />
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
