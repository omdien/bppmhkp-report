// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const tokenName = process.env.NEXT_PUBLIC_COOKIE_NAME || "token";
  const token = req.cookies.get(tokenName)?.value;

  // Guard hanya untuk halaman admin (mis. /dashboard). Login tidak ikut.
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";           // <-- TIDAK pakai /report di sini
    return NextResponse.redirect(url); // basePath akan otomatis diterapkan
  }

  // (Opsional) Validasi token ke backend
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Cookie: `${tokenName}=${token}` },
    });
    if (!res.ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ❗ tanpa basePath di matcher
export const config = {
  matcher: ["/dashboard/:path*"], // proteksi /report/dashboard (karena basePath otomatis)
};
