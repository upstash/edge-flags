import { NextRequest, NextResponse } from "next/server";
import { edgeFlagsMiddleware } from "@upstash/edge-flags";

export function middleware(req: NextRequest) {
  // const url = new URL(req.url);
  // if (url.pathname === "/api/edge-flags") {
  //   return edgeFlagsMiddleware(req);
  // }

  return NextResponse.next();
}
