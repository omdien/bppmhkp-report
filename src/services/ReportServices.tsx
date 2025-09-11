// src/services/ReportService.ts
import { reportFetch } from "@/utils/api";

// ----- Define response interfaces -----
export interface ReportEkspor {
  nomor_aju: string;
  tanggal_aju: string;
  tanggal_berangkat: string;
  no_hc: string;
  tanggal_smkhp: string;
  nama_upt: string;
  nama_trader: string;
  alamat_trader: string;
  nama_upi: string;
  alamat_upi: string;
  nama_partner: string;
  alamat_partner: string;
  ket_bentuk: string;
  pel_asal: string;
  pel_muat: string;
  negara_tujuan: string;
  pel_bongkar: string;
  hscode: string;
  kel_ikan: string;
  nm_dagang: string;
  nm_latin: string;
  netto: number;
  jumlah: number;
  satuan: string;
  nilai_rupiah: number;
  kurs_usd: number;
  nilai_usd: number;
  cara_angkut: string;
  alat_angkut: string;
  voyage: string;
}

// ----- Generic response type -----
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

// ----- Service Class -----
export default class ReportService {
  /**
   * Ambil data report ekspor dengan pagination + filter tanggal
   */
  static async getEksporReport(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ReportEkspor>> {
    return reportFetch<PaginatedResponse<ReportEkspor>>(
      `/ekspor/tr-report-ekspor/${kdUpt}?page=${page}&limit=${limit}&tglAwal=${tglAwal}&tglAkhir=${tglAkhir}`
    );
  }

  /**
   * Export laporan ekspor ke Excel
   */
  static async exportEksporReportToExcel(kdUpt: string): Promise<Blob> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_REPORT}/ekspor/tr-report-ekspor-excell/${kdUpt}`,
      {
        credentials: "include", // ⬅️ biar cookie (token) tetap dikirim
      }
    );

    if (!res.ok) {
      throw new Error(`Gagal export excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }
}
