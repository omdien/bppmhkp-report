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

// --- Tambahan Interface untuk SKP ---

export interface ResumeSKPResponse {
  sertifikat: number;
  upi: number;
  provinsi: number;
  kabupaten: number;
}

export interface KomposisiPeringkatSKP {
  peringkat: string;   // Contoh: "A", "B", "C"
  jumlah: number;
}

export interface TopUPISKP {
  nama_upi: string;
  jumlah: number;
}

export interface TopProvinsiSKP {
  provinsi: string;
  jumlah: number;
}

export interface KomposisiPermohonanSKP {
  jenis_permohonan: string; // Contoh: "Baru", "Perpanjangan"
  jumlah: number;
}

export interface DistribusiSkalaUsahaSKP {
  skala_usaha: string; // Contoh: "Kecil", "Menengah", "Besar"
  jumlah: number;
}

// 🟢 Tren bulanan SKP (misalnya jumlah sertifikat terbit per bulan)
export interface TrenBulananSKP {
  bulan: string;       // contoh: "Jan 2025" atau "2025-01"
  jumlah: number;      // jumlah SKP terbit di bulan tsb
}

// Komposisi Olahan
export interface KomposisiOlahanSKP {
  jenis_olahan: string; // Contoh: "Olahan 1", "Olahan 2"
  jumlah: number;
}

// Top Kabupaten/Kota
export interface TopKabupatenSKP {
  kota_kabupaten: string;
  jumlah: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ----- Service Class -----
export default class DashboardService {
  static async getSummaryEkspor(
    kdUpt: string,
    tglAwal: string,
    tglAkhir: string,
    negara = "",
    upt = "",
    komoditas = ""
  ): Promise<SummaryEkspor> {
    const params = new URLSearchParams();
    if (negara) params.set("negara", negara);
    if (upt) params.set("upt", upt);
    if (komoditas) params.set("komoditas", komoditas);

    const query = params.toString() ? `?${params.toString()}` : "";
    return dashboardFetch<SummaryEkspor>(
      `/ekspor/summary/${kdUpt}/${tglAwal}/${tglAkhir}${query}`
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

  // ----- Tambahan Method untuk SKP -----
  // 🟢 1️⃣ Resume SKP
  static async getResumeSKP(
    startDate?: string,
    endDate?: string
  ): Promise<ResumeSKPResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<ResumeSKPResponse>(
      `/skp/resume-skp?${params.toString()}`
    );
  }

  // 🟢 2️⃣ Tren Bulanan
  static async getTrenBulananSKP(
    startDate?: string,
    endDate?: string
  ): Promise<TrenBulananSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<TrenBulananSKP[]>(
      `/skp/tren-bulanan?${params.toString()}`
    );
  }

  // 🟢 3️⃣ Komposisi Peringkat
  static async getKomposisiPeringkatSKP(
    startDate?: string,
    endDate?: string
  ): Promise<KomposisiPeringkatSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<KomposisiPeringkatSKP[]>(
      `/skp/komposisi-peringkat?${params.toString()}`
    );
  }

  // 🟢 4️⃣ Top 10 UPI
  static async getTopUPISKP(
    startDate?: string,
    endDate?: string
  ): Promise<TopUPISKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<TopUPISKP[]>(`/skp/top-upi?${params.toString()}`);
  }

  // 🟢 5️⃣ Top 10 Provinsi
  static async getTopProvinsiSKP(
    startDate?: string,
    endDate?: string
  ): Promise<TopProvinsiSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<TopProvinsiSKP[]>(
      `/skp/top-provinsi?${params.toString()}`
    );
  }

  // 🟢 6️⃣ Komposisi Jenis Permohonan
  static async getKomposisiPermohonanSKP(
    startDate?: string,
    endDate?: string
  ): Promise<KomposisiPermohonanSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<KomposisiPermohonanSKP[]>(
      `/skp/komposisi-permohonan?${params.toString()}`
    );
  }

  // 🟢 7️⃣ Distribusi Skala Usaha
  static async getDistribusiSkalaUsahaSKP(
    startDate?: string,
    endDate?: string
  ): Promise<DistribusiSkalaUsahaSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<DistribusiSkalaUsahaSKP[]>(
      `/skp/distribusi-skala?${params.toString()}`
    );
  }

  // 🟢 8️⃣ Komposisi Olahan
  static async getKomposisiOlahanSKP(
    startDate?: string,
    endDate?: string
  ): Promise<KomposisiOlahanSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<KomposisiOlahanSKP[]>(
      `/skp/komposisi-olahan?${params.toString()}`
    );
  }

  // 🟢 9️⃣ Top 10 Kabupaten/Kota
  static async getTopKabupatenSKP(
    startDate?: string,
    endDate?: string
  ): Promise<TopKabupatenSKP[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    return dashboardFetch<TopKabupatenSKP[]>(
      `/skp/top-kabupaten?${params.toString()}`
    );
  }
}
