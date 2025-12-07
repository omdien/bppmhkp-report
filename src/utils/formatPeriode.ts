// Helper format tanggal: yyyy-mm-dd → dd-mm-yyyy
function formatTanggalIndo(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatPeriodeLaporan(startDate: string, endDate: string) {
  const bulanIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  const sameYear = d1.getFullYear() === d2.getFullYear();
  const sameMonth = d1.getMonth() === d2.getMonth();
  const fullMonth = 
    d1.getDate() === 1 &&
    d2.getDate() === new Date(d2.getFullYear(), d2.getMonth() + 1, 0).getDate();

  // Tahun penuh
  if (
    d1.getMonth() === 0 &&
    d1.getDate() === 1 &&
    d2.getMonth() === 11 &&
    d2.getDate() === 31
  ) {
    return `Tahun ${d1.getFullYear()}`;
  }

  // Bulan penuh
  if (sameYear && sameMonth && fullMonth) {
    return `Bulan ${bulanIndo[d1.getMonth()]} ${d1.getFullYear()}`;
  }

  // Custom periode (dd-mm-yyyy)
  return `Periode ${formatTanggalIndo(startDate)} s/d ${formatTanggalIndo(endDate)}`;
}
