// /api/edge-flags.ts

import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest): Promise<NextResponse> {
	const url = new URL(req.url);
	console.log(url.href);

	return new NextResponse(`params: ${url.searchParams.toString()}`);
}

/**
 * Edge flags only works on edge functions, it will break if you do not set the runtime
 */
export const config = {
	runtime: "experimental-edge",
};
