"use client";
import React, { useEffect, useState } from "react";
import { BoxIconLine, FrekIcon, RpIcon, UsdIcon } from "@/icons";
import DashboardService, { SummaryEkspor } from "@/services/DashboardServices";

export const ResumeEkspor = () => {
  // const [data, setData] = useState<SummaryEkspor[] | null>(null);
  const [data, setData] = useState<SummaryEkspor | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await DashboardService.getSummaryEkspor(
          "00.1",
          "2025-01-01",
          "2025-09-01"
        );
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // formatter angka biasa
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  // formatter angka dengan 2 digit desimal
  const formatNumber2Dec = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // formatter currency
  const formatCurrency = (value: number, currency: "IDR" | "USD") =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // hitung total dari array
  // const totalFreq = data?.reduce((acc, item) => acc + (item.JUMLAH ?? 0), 0) ?? 0;
  // const totalVolume = data?.reduce((acc, item) => acc + (item.NETTO ?? 0), 0) ?? 0;
  // const totalNilaiIDR = data?.reduce((acc, item) => acc + (item.NILAIIDR ?? 0), 0) ?? 0;
  // const totalNilaiUSD = data?.reduce((acc, item) => acc + (item.NILAIUSD ?? 0), 0) ?? 0;
  const totalFreq = data?.jumFreq ?? 0;
  const totalVolume = data?.totalVolume ?? 0;
  const totalNilaiIDR = data?.totalNilaiIDR ?? 0;
  const totalNilaiUSD = data?.totalNilaiUSD ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* Frekuensi */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FrekIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Frekuensi
          </span>
        </div>
        <div className="flex items-end justify-end mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber(totalFreq)}
          </h4>
        </div>
      </div>

      {/* Volume */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Volume (Ton)
          </span>
        </div>
        <div className="flex items-end justify-end mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatNumber2Dec(totalVolume / 1000)}
          </h4>
        </div>
      </div>

      {/* Nilai IDR */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <RpIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Nilai IDR (Juta)
          </span>
        </div>
        <div className="flex items-end justify-end mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatCurrency(totalNilaiIDR / 1_000_000, "IDR")}
          </h4>
        </div>
      </div>

      {/* Nilai USD */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <UsdIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            Nilai USD (Juta)
          </span>
        </div>
        <div className="flex items-end justify-end mt-5">
          <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatCurrency(totalNilaiUSD / 1_000_000, "USD")}
          </h4>
        </div>
      </div>
    </div>
  );
};
