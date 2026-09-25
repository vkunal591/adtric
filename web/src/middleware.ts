import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasAdminToken = request.cookies.has("admin_token");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!hasAdminToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (hasAdminToken && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
