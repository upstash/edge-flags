import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { environments } from "../dist";

import { Admin } from "./admin";
import { evaluate } from "./evaluation";
import { EvalRequest } from "./rules";
import { Environment } from "./types";

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
  const headers = new Headers();
  if (opts.cacheMaxAge && opts.cacheMaxAge > 0) {
    headers.set("Cache-Control", `s-maxage=${opts.cacheMaxAge}, public`);
  }

  return async (req: NextRequest, _event: NextFetchEvent) => {
    const url = new URL(req.url);

    const flagName = url.searchParams.get("flag");
    if (!flagName) {
      return new NextResponse("Missing parameter: flag", { status: 400 });
    }
    console.log("Evaluating flag", flagName);

    const redis =
      opts.redisUrl && opts.redisToken
        ? new Redis({
            url: opts.redisUrl,
            token: opts.redisToken,
          })
        : Redis.fromEnv();

    const admin = new Admin({ redis, prefix: opts.prefix });
    const flag = await admin.getFlag(flagName, (process.env.VERCEL_ENV as Environment) ?? "production");
    if (!flag) {
      return NextResponse.json(
        { error: `Flag not found: ${flagName}` },
        {
          status: 404,
          headers,
        },
      );
    }

    const evalRequest: EvalRequest = {};

    url.searchParams.forEach((value, key) => {
      evalRequest[key] = value;
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
        headers,
      },
    );
  };
}
