import { NextRequest, NextResponse } from "next/server";

export function edgeFlagsMiddleware(req: NextRequest): NextResponse {
  const url = new URL(req.url);

  console.log("Preparing geo data");
  console.log(JSON.stringify({ geo: req.geo }));

  if (typeof req.geo?.city !== "undefined") {
    url.searchParams.set("city", req.geo.city);
  }

  if (typeof req.geo?.country !== "undefined") {
    url.searchParams.set("country", req.geo?.country);
  }

  if (typeof req.geo?.region !== "undefined") {
    url.searchParams.set("region", req.geo.region);
  }

  if (typeof req.geo?.latitude !== "undefined") {
    url.searchParams.set("latitude", req.geo.latitude);
  }

  if (typeof req.geo?.longitude !== "undefined") {
    url.searchParams.set("longitude", req.geo.longitude);
  }

  if (typeof req.ip !== "undefined") {
    url.searchParams.set("ip", req.ip);
  }

  console.log("RW", url.href);

  return NextResponse.rewrite(url);
}
