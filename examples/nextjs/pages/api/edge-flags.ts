// /api/edge-flags.ts
import { createEdgeHandler } from "@upstash/edge-flags";

export default createEdgeHandler({
  redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Edge flags only works on edge functions, it will break if you do not set the runtime
 */
export const config = {
  runtime: "experimental-edge",
};
