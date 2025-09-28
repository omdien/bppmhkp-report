"use client";

import React, { useEffect, useState } from "react";
import ResumeCard from "@/components/dashboard/primer/ResumeCard";

export default function Page() {
  const [rekapIzin, setRekapIzin] = useState<{
    total?: number;
    CBIB?: number;
    CDOIB?: number;
    CPIB?: number;
    CPOIB?: number;
    CPPIB?: number;
  } | null>(null);

  useEffect(() => {
    // contoh fetch data dari API
    async function fetchData() {
      try {
        const res = await fetch("/api/report/primer"); // ganti endpoint sesuai backend kamu
        const data = await res.json();
        setRekapIzin(data?.rekap || null);
      } catch (err) {
        console.error("Gagal ambil data rekap izin:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Rekap Izin</h2>
      <ResumeCard rekapIzin={rekapIzin} />
    </div>
  );
}
