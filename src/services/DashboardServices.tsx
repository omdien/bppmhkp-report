// src/services/DashboardService.tsx
import { dashboardFetch } from "@/utils/api";

// ----- Define response interfaces -----
export interface SummaryEkspor {
  jumFreq: number;
  totalVolume: number;
  totalNilaiIDR: number;
  totalNilaiUSD: number;
}

export interface EksporHarian {
  TANGGAL: number;
  JUMLAH: number;
  NETTO: number;
  NILAIIDR: number;
  NILAIUSD: number;
}

export interface EksporBulanan {
  BULAN: number;      // 1 - 12
  JUMLAH: number;     // jumlah transaksi
  NETTO: number;      // volume ekspor
  NILAIIDR: number;   // nilai dalam Rupiah
  NILAIUSD: number;   // nilai dalam USD
}

export interface RekapIzinPrimer {
  propinsi: string;
  total: number;
  CPIB: number;
  CBIB: number;
  CPPIB: number;
  CPOIB: number;
  CDOIB: number;
  CBIB_Kapal: number;
}

export interface RekapIzinPrimerResponse {
  data: RekapIzinPrimer[];
  rekap: {
    CPIB: number;
    CBIB: number;
    CPPIB: number;
    CPOIB: number;
    CDOIB: number;
    CBIB_Kapal: number;
    total: number;
  };
}

export interface PropinsiPerIzin {
  URAIAN_PROPINSI: string;
  Jumlah: number;
}

export interface PropinsiPerIzinResponse {
  success: boolean;
  data: PropinsiPerIzin[];
}

// ----- Service Class -----
export default class DashboardService {
  static async getSummaryEkspor(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string
  ): Promise<SummaryEkspor> {
    return dashboardFetch<SummaryEkspor>(
      `/ekspor/summary/${kdUpt}/${tglAwal}/${tglAkhir}`
    );
  }

  static async getEksporHarian(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string
  ): Promise<EksporHarian[]> {
    return dashboardFetch<EksporHarian[]>(
      `/ekspor/harian/${kdUpt}/${tglAwal}/${tglAkhir}`
    );
  }

  static async getEksporBulanan(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string
  ): Promise<EksporBulanan[]> {
    return dashboardFetch<EksporBulanan[]>(
      `/ekspor/bulanan/${kdUpt}/${tglAwal}/${tglAkhir}`
    );
  }

  static async getRekapIzinPrimer(
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<RekapIzinPrimerResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (limit !== undefined) params.append("limit", limit.toString());

    return dashboardFetch<RekapIzinPrimerResponse>(
      `/primer/rekap-izin-primer?${params.toString()}`
    );
  }

  static async getPropinsiPerIzin(
    startDate: string,
    endDate: string,
    kdIzin: string,
    limit?: number
  ): Promise<PropinsiPerIzinResponse> {
    const params = new URLSearchParams();
    params.append("startDate", startDate);
    params.append("endDate", endDate);
    params.append("kdIzin", kdIzin);
    if (limit) params.append("limit", limit.toString());

    return dashboardFetch<PropinsiPerIzinResponse>(
      `/primer/propinsi-per-izin?${params.toString()}`
    );
  }
}
