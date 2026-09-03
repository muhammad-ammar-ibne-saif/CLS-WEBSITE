import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/config/constants";

const PROTECTED = [/^\/admin(?:\/|$)/, /^\/me(?:\/|$)/, /^\/ec(?:\/|$)/];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((rule) => rule.test(pathname))) {
    return NextResponse.next();
  }
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/me/:path*", "/ec/:path*"],
};
