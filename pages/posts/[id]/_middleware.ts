import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.url.includes("api")) {
    if (!req.cookies.motion) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }
  return NextResponse.json({ ok: true });
}
