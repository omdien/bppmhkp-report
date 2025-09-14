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

export interface RincianReportPrimer {
  idchecklist: number;
  tgl_izin: string;
  id_izin: string;
  jenis_izin: string;
  kd_izin: string;
  kd_daerah: string;
  nama_izin: string;
  no_izin: string;
  nib: string;
  tgl_permohonan: string;
  status_checklist: string;
  sts_aktif: string;
  komoditas?: string;
  uraian_propinsi?: string;
  npwp_perseroan?: string;
  nama_perseroan?: string;
  alamat_perseroan?: string;
  rt_rw_perseroan?: string;
  kelurahan_perseroan?: string;
  perseroan_daerah_id?: string;
  kode_pos_perseroan?: string;
  nomor_telpon_perseroan?: string;
  email_perusahaan?: string;
  total_sesuai?: number | null;
  total_minor?: number | null;
  total_mayor?: number | null;
  total_kritis?: number | null;
  total_hasil?: string | null;
  keterangan?: string | null;
}


// ----- Generic response type -----
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  totalPages: number;
  totalRecords: number;
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
  static async exportEksporReportToExcel(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string
  ): Promise<Blob> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_REPORT}/ekspor/tr-report-ekspor-excell/${kdUpt}?tglAwal=${tglAwal}&tglAkhir=${tglAkhir}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Gagal export excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

  /**
   * Ambil pivot propinsi-izin
   */
  static async getPropinsiIzin(
    tglAwal: string,
    tglAkhir: string
  ): Promise<PropinsiIzinPivot[]> {
    return reportFetch<PropinsiIzinPivot[]>(
      `/primer/propinsi-izin?tgl_awal=${tglAwal}&tgl_akhir=${tglAkhir}`
    );
  }

  /**
 * Export pivot propinsi-izin ke Excel
 * Route backend: GET /primer/export-propinsi-izin
 */
  static async exportPropinsiIzinToExcel(
    tglAwal: string,
    tglAkhir: string
  ): Promise<Blob> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_REPORT}/primer/export-propinsi-izin?tgl_awal=${tglAwal}&tgl_akhir=${tglAkhir}`,
      { credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(`Gagal export excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

  /**
   * Ambil rincian report primer (dengan pagination dan filter)
   */
  static async getRincianReportPrimer(
    tglAwal: string,
    tglAkhir: string,
    statusChecklist: string = "50",
    kdIzin?: string,
    kdDaerahPrefix?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<RincianReportPrimer>> {
    let url = `/primer/rincian-report?` +
      `tgl_awal=${tglAwal}&tgl_akhir=${tglAkhir}` +
      `&status_checklist=${statusChecklist}` +
      `&page=${page}&limit=${limit}`;

    if (kdIzin) url += `&kd_izin=${kdIzin}`;
    if (kdDaerahPrefix) url += `&kd_daerah_prefix=${kdDaerahPrefix}`;

    // return dengan type PaginatedResponse agar konsisten dengan report ekspor
    return reportFetch<PaginatedResponse<RincianReportPrimer>>(url);
  }

  /**
 * Export rincian report primer ke Excel (sesuai filter terakhir)
 * Route backend: GET /primer/export-rincian-report
 */
  static async exportRincianReportPrimerToExcel(
    tglAwal: string,
    tglAkhir: string,
    statusChecklist: string = "50",
    kdIzin?: string,
    kdDaerahPrefix?: string
  ): Promise<Blob> {
    let query = `tgl_awal=${tglAwal}&tgl_akhir=${tglAkhir}&status_checklist=${statusChecklist}`;
    if (kdIzin) query += `&kd_izin=${kdIzin}`;
    if (kdDaerahPrefix) query += `&kd_daerah_prefix=${kdDaerahPrefix}`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_REPORT}/primer/export-rincian-report?${query}`,
      { credentials: "include" }
    );

    if (!res.ok) throw new Error(`Gagal export excel: ${res.statusText}`);
    return res.blob();
  }
}
