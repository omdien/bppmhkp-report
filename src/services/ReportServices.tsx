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
  CBIB_Kapal: number;
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

export interface ReportSKP {
  id: number;
  nama_upi: string;
  nib: string;
  provinsi: string;
  kota_kabupaten: string;
  alamat: string;
  skala_usaha: string;
  jenis_permohonan: string;
  tanggal_pengajuan: string;
  tanggal_rekomendasi: string;
  tanggal_terbit: string;
  tanggal_kadaluarsa: string;
  nomor_skp: string;
  nama_produk: string;
  jenis_olahan: string;
  peringkat: string;
}

export interface RekapSKPProvinsi {
  provinsi: string;
  jumlah: number;
}

export interface ReportPNBPFlat {
  id_trx_svr_header: string;
  no_bill: string;
  ntpn: string;
  date_payment: string;
  date_pembukuan: string;
  bank_id: string;
  date_bill: string;
  date_bill_exp: string;
  kd_satker: string;
  NM_UNIT: string;
  nm_wjb_byr: string;
  kd_satker_pemungut: string;
  npwp: string;
  nomor_aju: string;
  nomor_pnbp: string;
  kd_tarif: string;
  pp: string;
  kd_akun: string;
  nominal: number;
  volume: number;
  satuan: string;
  kd_lokasi: string;
  kd_kabkota: string;
  kd_upt: string;
  bank_name: string;
}

// Summary untuk PNBP
export interface ReportPNBPSummary {
  totalBill: number;
  totalNTPN: number;
  totalNominal: number;
  totalNomorAju: number;
}

// ---- Interface untuk CBIB Kapal ----
export interface CBIBKapal {
  id_cbib: number;
  no_cbib: string;
  nama_kapal: string;
  nib: string;
  alamat: string;
  gt: number;
  tipe_kapal: string;
  tgl_inspeksi: string;
  tgl_laporan: string | null;
  jenis_produk: string;
  grade_scpib: string;
  tgl_terbit: string;
  tgl_kadaluarsa: string;
  upt_inspeksi: string;
  nama_pelabuhan: string;
  nama_provinsi: string;
  nama_pemilik: string;
  telepon: string;
  nahkoda_kapal: string;
  jumlah_abk: number;
  alat_tangkap: string;
  daerah_tangkap: string;
  no_siup: string;
  tgl_siup: string;
  no_kbli: string;
  no_skkp_bkp_nk: string;
  tgl_skkp_bkp_nk: string;
  pj_pusat: string;
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
      `/primer/pivot-propinsi-izin?startDate=${tglAwal}&endDate=${tglAkhir}`
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

  /**
   * Ambil data laporan SKP
   * backend route: GET /api/report/skp/get-report-skp
   * query: startDate, endDate, provinsi (opsional)
   */
  static async getReportSKP(
    startDate: string,
    endDate: string,
    provinsi?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ReportSKP>> {
    let url = `/skp/get-report-skp?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
    if (provinsi) url += `&provinsi=${encodeURIComponent(provinsi)}`;

    return reportFetch<PaginatedResponse<ReportSKP>>(url);
  }

  static async getReportSKPToExcel(
    startDate: string,
    endDate: string,
    provinsi?: string
  ): Promise<Blob> {
    // buat query params
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (provinsi) params.append("provinsi", provinsi);

    const url = `${process.env.NEXT_PUBLIC_API_URL_REPORT}/skp/get-report-skp-to-excell?${params.toString()}`;

    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Gagal export Excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

  static async getRekapProvinsi(
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<RekapSKPProvinsi[]> {
    let url = `/skp/rekap-provinsi`;
    const params: string[] = [];

    if (startDate && endDate) {
      params.push(`startDate=${encodeURIComponent(startDate)}`);
      params.push(`endDate=${encodeURIComponent(endDate)}`);
    }

    if (limit) {
      params.push(`limit=${limit}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    // return reportFetch<RekapSKPProvinsi[]>(url);
    const res = await reportFetch<{ success: boolean; data: RekapSKPProvinsi[] }>(url);
    return res.data; // selalu balikin array
  }

  static async getRekapProvinsiToExcel(
    startDate: string,
    endDate: string,
    limit?: number
  ): Promise<Blob> {
    // buat query params
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (limit) params.append("limit", limit.toString());

    const url = `${process.env.NEXT_PUBLIC_API_URL_REPORT}/skp/rekap-provinsi-to-excell?${params.toString()}`;

    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Gagal export Excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

  /**
   * Ambil data report PNBP (flat join)
   * backend route: GET /pnbp/report-pnbp-flat
   */
  static async getReportPNBPFlat(
    filterType: "datePayment" | "dateBook",
    startDate: string,
    endDate: string,
    idUPT: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ReportPNBPFlat>> {
    let url = `/pnbp/report-pnbp-flat?filterType=${encodeURIComponent(filterType)}`;
    url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    url += `&idUPT=${encodeURIComponent(idUPT)}`;
    url += `&page=${page}&limit=${limit}`;

    return reportFetch<PaginatedResponse<ReportPNBPFlat>>(url);
  }

  static async getReportPNBPSummary(
    filterType: "datePayment" | "dateBook",
    startDate: string,
    endDate: string,
    idUPT: string
  ): Promise<ReportPNBPSummary> {
    let url = `/pnbp/report-pnbp-summary?filterType=${encodeURIComponent(filterType)}`;
    url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    url += `&idUPT=${encodeURIComponent(idUPT)}`;

    // 🔹 Ambil response JSON
    const res = await reportFetch<{ success: boolean; summary: ReportPNBPSummary }>(url);

    return res.summary;
  }

  static async getReportPNBPFlatToExcell(
    filterType: "datePayment" | "dateBook",
    startDate: string,
    endDate: string,
    idUPT: string
  ): Promise<Blob> {
    // gunakan URL relatif agar base URL dari reportFetch otomatis
    const url = `${process.env.NEXT_PUBLIC_API_URL_REPORT}/pnbp/report-pnbp-flat-to-excel?filterType=${encodeURIComponent(filterType)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&idUPT=${encodeURIComponent(idUPT)}`;

    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Gagal export Excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

  static async getReportCBIBKapal(
    startDate: string,
    endDate: string,
    provinsi?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<CBIBKapal>> {
    let url = `/cbibkapal/get-report-cbib-kapal`;
    url += `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    url += `&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;
    if (provinsi) url += `&provinsi=${encodeURIComponent(provinsi)}`;

    // 🔹 Ambil response JSON
    const res = await reportFetch<PaginatedResponse<CBIBKapal>>(url);

    return res; // langsung sesuai generic type
  }

  /**
   * Export laporan CBIB Kapal ke Excel
   * backend route: GET /api/report/cbibkapal/get-report-cbib-kapal-to-excell
   */
  static async exportRincianCBIBKapalToExcel(
    startDate: string,
    endDate: string,
    provinsi?: string
  ): Promise<Blob> {
    // buat query params
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (provinsi) params.append("provinsi", provinsi);

    const url = `${process.env.NEXT_PUBLIC_API_URL_REPORT}/cbibkapal/get-report-cbib-kapal-to-excell?${params.toString()}`;

    const res = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      throw new Error(`Gagal export Excel: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

}
