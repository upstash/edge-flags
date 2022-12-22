// /api/edge-flags.ts
import { createHandler } from "@upstash/edge-flags";

import type { NextRequest } from "next/server";
const identify = (req: NextRequest) => req.ip ?? "anon";

export default createHandler({
	cacheMaxAge: 10,
	identify,
	redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
	redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Edge flags only works on edge functions, it will break if you do not set the runtime
 */
export const config = {
	runtime: "experimental-edge",
};
