import DashboardService, { RekapIzinPrimerResponse, PropinsiPerIzin } from "@/services/DashboardServices";
import { useEffect, useState, useCallback, useMemo } from "react";
import { usePeriode } from "@/context/PeriodeContext";
import { useUser } from "@/context/UserContext";
import ResumeCard from "./ResumeCard";
import GrafikPrimerKhusus from "./GrafikPrimerKhusus";
import TabelPrimer from "./TabelPrimer";
import ReportService, {
    PropinsiIzinPivot,
} from "@/services/ReportServices";
import ComponentCard from "@/components/common/ComponentCard";

export const DashboardPrimer = () => {
    const { periode } = usePeriode();
    const { user } = useUser();

    const [rekapIzin, setRekapIzin] = useState<RekapIzinPrimerResponse | null>(null);
    const [propinsiData, setPropinsiData] = useState<PropinsiIzinPivot[]>([]);
    const [dataPerIzin, setDataPerIzin] = useState<Record<string, PropinsiPerIzin[]>>({});

    const izinList = useMemo(
    () => [
      { kode: "032000000034", nama: "CPIB", warna: "#0071CE" },
      { kode: "032000000068", nama: "CBIB", warna: "#FCD58A" },
      { kode: "032000000014", nama: "CPPIB", warna: "#CF0F47" },
      { kode: "032000000019", nama: "CPOIB", warna: "#004D40" },
      { kode: "032000000033", nama: "CBIB_KAPAL", warna: "#00ACC1" },
      { kode: "032000000036", nama: "CDOIB", warna: "#4BA38A" },
    ],
    [] // kosong → daftar izin ini tetap sama selama komponen hidup
  );

    /* ------------------ Fetch Summary ------------------ */
    const fetchSummaryPrimer = async (startDate: string, endDate: string) => {
        try {
            const result = await DashboardService.getRekapIzinPrimer(startDate, endDate, 1);
            setRekapIzin(result);
        } catch (err) {
            console.error("Gagal fetch rekap izin:", err);
        }
    };

    const fetchTabelPrimer = async (startDate: string, endDate: string) => {
        try {
            const result = await ReportService.getPropinsiIzin(startDate, endDate);
            setPropinsiData(result);
        } catch (err) {
            console.error("Gagal fetch propinsi pivot:", err);
        }
    };

    /* ------------------ Fetch Semua Grafik Per Izin ------------------ */
    const fetchAllPropinsiPerIzin = useCallback(async (startDate: string, endDate: string) => {
        try {
            const responses = await Promise.all(
                izinList.map((izin) =>
                    DashboardService.getPropinsiPerIzin(startDate, endDate, izin.kode, 5)
                )
            );

            const newData: Record<string, PropinsiPerIzin[]> = {};
            izinList.forEach((izin, i) => {
                newData[izin.nama] = responses[i].data || [];
            });

            setDataPerIzin(newData);
        } catch (err) {
            console.error("Gagal fetch semua propinsi per izin:", err);
        }
    }, [izinList]);

    /* ------------------ useEffect ------------------ */
    useEffect(() => {
        if (!user || !periode.startDate || !periode.endDate) return;

        fetchSummaryPrimer(periode.startDate, periode.endDate);
        fetchTabelPrimer(periode.startDate, periode.endDate);
        fetchAllPropinsiPerIzin(periode.startDate, periode.endDate);
    }, [user, periode.startDate, periode.endDate, fetchAllPropinsiPerIzin]);

    /* ------------------ Render ------------------ */
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Resume Card */}
            <div className="col-span-12 space-y-6">
                <ResumeCard rekapIzin={rekapIzin?.rekap} />
            </div>

            {/* Grafik Umum */}
            {/* <div className="col-span-12">
                <h1 className="text-lg font-semibold mb-2">
                    Grafik Sertifikasi Mutu Primer per Provinsi
                </h1>
                <GrafikPrimer rekapPrimer={rekapIzin?.data || []} />
            </div> */}

            {/* Grafik Per Jenis Izin */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {izinList.map((izin) => (
                    <GrafikPrimerKhusus
                        key={izin.nama}
                        data={(dataPerIzin[izin.nama] || []).map((item) => ({
                            label: item.URAIAN_PROPINSI,
                            value: item.Jumlah,
                        }))}
                        title={`Top 5 ${izin.nama} Per Propinsi`}
                        warna={izin.warna}
                    />
                ))}
            </div>
            <div className="col-span-12">
                <ComponentCard title="Rincian Sertifikasi Mutu Primer per Provinsi">
                    <TabelPrimer data={propinsiData} />
                </ComponentCard>
            </div>
        </div>
    );
};

export default DashboardPrimer;
