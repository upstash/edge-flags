import { createEdgeHandler } from "@upstash/edge-flags";

export const GET = createEdgeHandler({
  maxAge: 10,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const runtime = "edge";

// NOTE: For pages router, just default export the handler itself
/*
export default createEdgeHandler({
  maxAge: 10,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
*/
