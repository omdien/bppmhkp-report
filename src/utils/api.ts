// src/utils/api.ts
const DASHBOARD_API_URL = process.env.NEXT_PUBLIC_API_URL_DASHBOARD;
const REPORT_API_URL = process.env.NEXT_PUBLIC_API_URL_REPORT;

async function baseFetch<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // ambil token dari localStorage kalau ada
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export function dashboardFetch<T>(endpoint: string, options: RequestInit = {}) {
  return baseFetch<T>(DASHBOARD_API_URL!, endpoint, options);
}

export function reportFetch<T>(endpoint: string, options: RequestInit = {}) {
  return baseFetch<T>(REPORT_API_URL!, endpoint, options);
}
