"use client";

import { useEffect, useState } from "react";
import FilterEksporService, { OptionItem } from "@/services/FilterEksporServices";

interface FilterValues {
    negara: string;
    upt: string;
    komoditas: string;
}

interface FilterBarProps {
    onApply: (filters: FilterValues) => void;
}

export default function FilterBar({ onApply }: FilterBarProps) {
    const [negaraOpts, setNegaraOpts] = useState<OptionItem[]>([]);
    const [uptOpts, setUptOpts] = useState<OptionItem[]>([]);
    const [komoditasOpts, setKomoditasOpts] = useState<OptionItem[]>([]);

    const [negara, setNegara] = useState("");
    const [upt, setUpt] = useState("");
    const [komoditas, setKomoditas] = useState("");

    useEffect(() => {
        FilterEksporService.getNegaraOptions().then(setNegaraOpts);
        FilterEksporService.getUptOptions().then(setUptOpts);
        FilterEksporService.getKomoditasOptions().then(setKomoditasOpts);
    }, []);

    const handleApply = () => {
        onApply({ negara, upt, komoditas });
    };

    const selectClass =
        "w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-gray-700 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition cursor-pointer";

    return (
        <div className="relative rounded-2xl border border-gray-300 dark:border-white/[0.1] bg-gray-50/60 dark:bg-white/[0.02] px-6 pt-5 pb-4 mb-6">
            {/* Floating label */}
            <span className="absolute -top-3 left-5 bg-white dark:bg-gray-900 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Filter
            </span>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Negara */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Negara
                    </label>
                    <select value={negara} onChange={(e) => setNegara(e.target.value)} className={selectClass}>
                        <option value="">Semua</option>
                        {negaraOpts.map((opt, index) => (
                            <option
                                key={`negara-${opt.uraian ?? opt.uraian}-${index}`}
                                value={opt.uraian ?? opt.uraian}
                            >
                                {opt.uraian}
                            </option>
                        ))}
                    </select>
                </div>

                {/* UPT */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        UPT
                    </label>
                    <select value={upt} onChange={(e) => setUpt(e.target.value)} className={selectClass}>
                        <option value="">Semua</option>
                        {uptOpts.map((opt, index) => (
                            <option
                                key={`upt-${opt.kode ?? opt.uraian}-${index}`}
                                value={opt.kode ?? opt.uraian}
                            >
                                {opt.uraian}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Komoditas */}
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        Komoditas
                    </label>
                    <select value={komoditas} onChange={(e) => setKomoditas(e.target.value)} className={selectClass}>
                        <option value="">Semua</option>
                        {komoditasOpts.map((opt, index) => (
                            <option
                                key={`komoditas-${opt.uraian}-${index}`}
                                value={opt.uraian}
                            >
                                {opt.uraian}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tombol */}
                <div className="flex-shrink-0">
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 text-sm font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white transition-colors shadow-sm whitespace-nowrap"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}