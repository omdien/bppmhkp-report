import { reportFetch } from "@/utils/api";

export interface PropinsiIzinPivot {
    kode_propinsi: string;
    propinsi: string;
    JUMLAH: number;
    CPPIB: number;
    CPIB: number;
    CPOIB: number;
    "CBIB Kapal": number;
    CDOIB: number;
    CBIB: number;
    nama_propinsi?: string;
}

// ----- Service Class -----
export default class PublicService {
    /**
       * Ambil pivot propinsi-izin
       */
    static async getPublicPropinsiIzin(
        tglAwal: string,
        tglAkhir: string
    ): Promise<PropinsiIzinPivot[]> {
        return reportFetch<PropinsiIzinPivot[]>(
            `/public/primer/propinsi-izin?tgl_awal=${tglAwal}&tgl_akhir=${tglAkhir}`
        );
    }
}