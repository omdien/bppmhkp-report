"use client";
import { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";

type Periode = {
  startDate: string; // format: YYYY-MM-DD
  endDate: string;   // format: YYYY-MM-DD
};

type PeriodeProps = {
  startDate?: string; 
  endDate?: string;
  onSubmit: (periode: Periode) => void;
};

export default function PeriodePicker({ startDate, endDate, onSubmit }: PeriodeProps) {
  const [start, setStart] = useState<Date | null>(startDate ? new Date(startDate) : null);
  const [end, setEnd] = useState<Date | null>(endDate ? new Date(endDate) : null);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

    // kirim balik ke komponen pemanggil
    onSubmit({
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <label className=" text-gray-500 dark:text-gray-400 font-medium">Periode</label>

      <DatePicker
        selected={start}
        onChange={(date: Date | null) => setStart(date)}
        selectsStart
        startDate={start}
        endDate={end}
        placeholderText="Tanggal Awal"
        className="w-28 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2  text-gray-500 dark:text-gray-400 focus:ring-blue-400"
        dateFormat="dd-MM-yyyy"
      />

      <label className=" text-gray-500 dark:text-gray-400 font-medium">s/d</label>

      <DatePicker
        selected={end}
        onChange={(date: Date | null) => setEnd(date)}
        selectsEnd
        startDate={start}
        endDate={end}
        minDate={start || undefined}
        placeholderText="Tanggal Akhir"
        className="w-28 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2  text-gray-500 dark:text-gray-400 focus:ring-blue-400"
        dateFormat="dd-MM-yyyy"
      />

      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition"
      >
        Terapkan
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
