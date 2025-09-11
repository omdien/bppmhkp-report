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
}
