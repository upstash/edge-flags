import { NextRequest, NextResponse } from "next/server";
import { edgeFlagsMiddleware } from "@upstash/edge-flags";

export async function middleware(req: NextRequest) {
	const url = new URL(req.url);
	if (url.pathname === "/api/edge-flags") {
		return await edgeFlagsMiddleware(req, {
			userId: req.ip ?? "unknown",
		});
	}

	return NextResponse.next();
}
