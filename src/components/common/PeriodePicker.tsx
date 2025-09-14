"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Button from "@/components/ui/button/Button";

export type Periode = {
  startDate: string; // format YYYY-MM-DD
  endDate: string;   // format YYYY-MM-DD
};

type PeriodePickerProps = {
  startDate?: string;
  endDate?: string;
  onSubmit: (periode: Periode) => void;
  minDate?: string; // opsional, untuk batasi tanggal awal
  maxDate?: string; // opsional, untuk batasi tanggal akhir
  defaultStartDate?: string; // opsional, default internal jika startDate kosong
  defaultEndDate?: string;   // opsional, default internal jika endDate kosong
};

export default function PeriodePicker({
  startDate,
  endDate,
  onSubmit,
  minDate,
  maxDate,
  defaultStartDate = "2025-01-01",
  defaultEndDate = "2025-12-31",
}: PeriodePickerProps) {
  const [start, setStart] = useState<Date | null>(
    startDate ? new Date(startDate) : new Date(defaultStartDate)
  );
  const [end, setEnd] = useState<Date | null>(
    endDate ? new Date(endDate) : new Date(defaultEndDate)
  );
  const [error, setError] = useState<string>("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setError("");

    if (!start || !end) {
      setError("Tanggal awal dan akhir wajib dipilih.");
      return;
    }

    if (start.getFullYear() !== end.getFullYear()) {
      setError("Tanggal harus dalam tahun yang sama.");
      return;
    }

    if (end < start) {
      setError("Tanggal akhir tidak boleh lebih kecil dari tanggal awal.");
      return;
    }

    onSubmit({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <label className="text-gray-500 dark:text-gray-400 font-medium">Periode</label>

      <DatePicker
        selected={start}
        onChange={(date: Date | null) => setStart(date)}
        selectsStart
        startDate={start}
        endDate={end}
        minDate={minDate ? new Date(minDate) : undefined}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        placeholderText="Tanggal Awal"
        className="w-28 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 text-gray-500 dark:text-gray-400 focus:ring-blue-400"
        dateFormat="dd-MM-yyyy"
      />

      <label className="text-gray-500 dark:text-gray-400 font-medium">s/d</label>

      <DatePicker
        selected={end}
        onChange={(date: Date | null) => setEnd(date)}
        selectsEnd
        startDate={start}
        endDate={end}
        minDate={start || (minDate ? new Date(minDate) : undefined)}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        placeholderText="Tanggal Akhir"
        className="w-28 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 text-gray-500 dark:text-gray-400 focus:ring-blue-400"
        dateFormat="dd-MM-yyyy"
      />

      <Button size="sm" variant="outline" onClick={handleSubmit}>
        Terapkan
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
