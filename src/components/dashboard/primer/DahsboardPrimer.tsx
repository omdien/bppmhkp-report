import DashboardService, { RekapIzinPrimerResponse } from "@/services/DashboardServices";
import { useEffect, useState } from "react";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import ResumeCard from "./ResumeCard";

export const DashboardPrimer = () => {
    const { periode } = usePeriode();
    const { user } = useUser();
    const [rekapIzin, setRekapIzin] = useState<RekapIzinPrimerResponse | null>(null);
    const fetchSummaryPrimer = async (
        startDate: string,
        endDate: string
    ) => {
        try {
            const result = await DashboardService.getRekapIzinPrimer(
                startDate,
                endDate,
                1
            );
            setRekapIzin(result);
            console.log(result)
        } catch (err) {
            console.error("Gagal fetch rekap izin:", err);
        }
    };
    useEffect(() => {
        if (!user || !periode.startDate || !periode.endDate) return;
        fetchSummaryPrimer(periode.startDate, periode.endDate);
    }, [user, periode.startDate, periode.endDate]);
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Resume Card */}
            <div className="col-span-12 space-y-6">
                <ResumeCard rekapIzin={rekapIzin?.rekap} />
            </div>
        </div>
    );
};

export default DashboardPrimer;