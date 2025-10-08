// src/utils/api.ts
const DASHBOARD_API_URL = process.env.NEXT_PUBLIC_API_URL_DASHBOARD;
const REPORT_API_URL = process.env.NEXT_PUBLIC_API_URL_REPORT;

/**
 * Base fetch helper — otomatis sertakan cookie SSO (HttpOnly)
 * Tidak perlu lagi pakai Authorization header manual.
 */
async function baseFetch<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}), // jika ada tambahan header custom
    },
    credentials: "include", // penting: kirim cookie cross-domain
  });

  if (!res.ok) {
    // opsional: bisa logging lebih detail di dev
    console.error(`❌ Fetch error: ${res.status} ${res.statusText}`);
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Wrapper untuk request ke backend Dashboard.
 */
export function dashboardFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return baseFetch<T>(DASHBOARD_API_URL!, endpoint, options);
}

/**
 * Wrapper untuk request ke backend Report.
 */
export function reportFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return baseFetch<T>(REPORT_API_URL!, endpoint, options);
}
