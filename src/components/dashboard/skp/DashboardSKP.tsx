import { useEffect, useState } from "react";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import ReportService, {
    RekapSKPProvinsi,
} from "@/services/ReportServices";
import TabelSKP from "./TabelSKP";

export const DashboardSKP = () => {
    const { periode } = usePeriode();
    const { user } = useUser();

    const [rekapProvinsi, setRekapProvinsi] = useState<RekapSKPProvinsi[]>([]);

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
        fetchRekapSKP(periode.startDate, periode.endDate, 100);
    }, [user, periode.startDate, periode.endDate]);

    /* ------------------ Render ------------------ */
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-12">
                {/* <ComponentCard title="Dashboard SKP"> */}
                     <TabelSKP data={rekapProvinsi} />
                {/* </ComponentCard> */}
            </div>
        </div>
    );
};

export default DashboardSKP;
