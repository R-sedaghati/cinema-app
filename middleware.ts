import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MOBILE_UA =
  /Mobile|Android|iP(hone|od|ad)|BlackBerry|IEMobile|Opera Mini/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (MOBILE_UA.test(ua)) {
    return NextResponse.redirect(new URL("/application", request.url));
  }
}

export const config = {
  matcher: ["/"],
};
