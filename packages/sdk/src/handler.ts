import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

import { Admin } from "./admin";
import { evaluate } from "./evaluation";
import { EvalRequest } from "./rules";
import { Environment, Flag } from "./types";

export type HandlerConfig = (
  | {
      redisUrl: string;
      redisToken: string;
    }
  | {
      redisUrl?: never;
      redisToken?: never;
    }
) & {
  /**
   * How long to cache the result
   * in seconds
   *
   * Set to 0 to disable caching
   */
  cacheMaxAge: number;

  /**
   * Prefix all keys in redis
   *
   * @default `edge-flags`
   */
  prefix?: string;
};

/**
 * createHandler should be default exported by the user in an edge compatible api route
 */
export function createEdgeHandler(opts: HandlerConfig): NextMiddleware {
  const cache = new Map<string, Flag>();
  const redis =
    opts.redisUrl && opts.redisToken
      ? new Redis({
          url: opts.redisUrl,
          token: opts.redisToken,
        })
      : Redis.fromEnv();
  const admin = new Admin({ redis, prefix: opts.prefix });

  return async (req: NextRequest, _event: NextFetchEvent) => {
    const url = new URL(req.url);

    const headers = new Headers();

    let flagName = url.searchParams.get("_flag");
    if (!flagName) {
      return new NextResponse("Missing parameter: _flag", { status: 400 });
    }
    flagName = decodeURIComponent(flagName);
    console.log("Evaluating flag", flagName);

    let flag = cache.get(flagName);
    if (flag) {
      headers.set("X-Edge-Flags-Cache", "hit");
    } else {
      headers.set("X-Edge-Flags-Cache", "miss");
      const redisStart = Date.now();
      const loaded = await admin.getFlag(flagName, (process.env.VERCEL_ENV as Environment) ?? "production");
      headers.set("X-Redis-Latency", (Date.now() - redisStart).toString());
      if (loaded) {
        flag = loaded;
        cache.set(flagName, loaded);
      }
    }

    if (!flag) {
      return NextResponse.json(
        { error: `Flag not found: ${flagName}` },
        {
          status: 404,
          headers,
        },
      );
    }

    const evalRequest: EvalRequest = req.geo ?? {};

    url.searchParams.forEach((value, key) => {
      evalRequest[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(evalRequest)));
    const hashSum = Array.from(new Uint8Array(hash)).reduce((sum, x) => {
      sum += x;
      return sum;
    }, 0);

    const percentage = hashSum % 100;

    const value = evaluate(flag, percentage, evalRequest);

    /**
     * No rule applied
     */
    return NextResponse.json(
      { value },
      {
        status: 200,
      },
    );
  };
}
