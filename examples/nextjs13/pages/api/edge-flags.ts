import { createHandler } from "@upstash/edge-flags";
import { NextRequest } from "next/server";

/**
 * Define a function to identify the user from an incoming request
 *
 * This could be a userId from a session cookie for example
 */
const identify = (req: NextRequest) => req.cookies.get("fancy cookie");
export default createHandler({
	redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
	redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
	identify,
});

export const config = {
	runtime: "experimental-edge",
};
