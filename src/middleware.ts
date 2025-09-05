import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const tokenName = process.env.NEXT_PUBLIC_COOKIE_NAME || "token";
  const token = req.cookies.get(tokenName)?.value;
  const url = req.nextUrl.clone();

  // user sudah login → redirect /login → /dashboard
  if (token && url.pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // belum login → /dashboard → redirect /login
  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
