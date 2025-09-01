// src/services/DashboardService.tsx
import { apiFetch } from "@/utils/api";

// ----- Define response interfaces -----
export interface SummaryEkspor {
  TANGGAL: number;
  JUMLAH: number;
  NETTO: number;
  NILAIIDR: number;
  NILAIUSD: number;
}

export interface FrequensiEkspor {
  TANGGAL: number;
  FREQUENSI: number;
}

export interface VolumeEkspor {
  TANGGAL: number;
  VOLUME: number;
}

// ----- Service Class -----
export default class DashboardService {
  static async getSummaryEkspor(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string
  ): Promise<SummaryEkspor[]> {
    return apiFetch<SummaryEkspor[]>(
      `/ekspor/summary/${kdUpt}/${tglAwal}/${tglAkhir}`
    );
  }

//   static async getFrequensiEkspor(
//     kdUpt: string,
//     tglAwal: string,
//     tglAkhir: string
//   ): Promise<FrequensiEkspor[]> {
//     return apiFetch<FrequensiEkspor[]>(
//       `/ekspor/frequensi/${kdUpt}/${tglAwal}/${tglAkhir}`
//     );
//   }

//   static async getVolumeEkspor(
//     kdUpt: string,
//     tglAwal: string,
//     tglAkhir: string
//   ): Promise<VolumeEkspor[]> {
//     return apiFetch<VolumeEkspor[]>(
//       `/ekspor/volume/${kdUpt}/${tglAwal}/${tglAkhir}`
//     );
//   }
}
