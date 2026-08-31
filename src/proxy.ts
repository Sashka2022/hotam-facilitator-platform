import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "hotam_admin";
const MAX_AGE = 60 * 60 * 24 * 365;

export function proxy(req: NextRequest) {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key) return NextResponse.next();

  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith("/api/") && req.method === "GET") {
    return NextResponse.next();
  }

  const cookieValue = req.cookies.get(ADMIN_COOKIE)?.value;
  const queryKey = searchParams.get("key");
  const authorized = cookieValue === key || queryKey === key;

  if (!authorized) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin-locked", req.url));
  }

  if (queryKey === key && cookieValue !== key) {
    const clean = new URL(pathname, req.url);
    const res = pathname.startsWith("/api/") ? NextResponse.next() : NextResponse.redirect(clean);
    res.cookies.set(ADMIN_COOKIE, key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/materials/:path*", "/api/plenary/:path*", "/api/upload/:path*"],
};
