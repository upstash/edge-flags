import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest): Promise<NextResponse> {
	const url = new URL("/api/rw-target-serverless", req.url);
	url.searchParams.set("x", "x");

	console.log("RW", url.href);
	return NextResponse.rewrite(url.href);
}

export const config = {
	runtime: "experimental-edge",
};
