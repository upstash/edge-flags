import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Client as EdgeFlags } from "@upstash/edge-flags";

const edgeFlags = new EdgeFlags({ redis: Redis.fromEnv() });
export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const enabled = await edgeFlags.getFlag("eu-countries", req.geo ?? {}).catch((err) => {
    console.error(err);
    return false;
  });

  if (!enabled) {
    const url = new URL(req.url);
    url.pathname = "/blocked";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
