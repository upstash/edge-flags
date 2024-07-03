import { useCallback, useEffect, useMemo, useState } from "react";

export type UseFlag = {
  isLoading: boolean;
  error: string | null;
  isEnabled: boolean | null;
  refresh: () => Promise<void>;
  /**
   * For development purposes only
   *
   * This can change at any time
   */
  debug: {
    latency: {
      total: number | null;
      edge: number | null;
      redis: number | null;
    };

    cache: {
      memory: string | null;
      vercel: string | null;
    };
  };
};

export function useFlag(
  flag: string,
  attributes?: Record<string, string | number | boolean>
): UseFlag {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [redisLatency, setRedisLatency] = useState<number | null>(null);
  const [edgeLatency, setEdgeLatency] = useState<number | null>(null);
  const [memoryCacheHit, setMemoryCacheHit] = useState<string | null>(null);
  const [vercelCacheHit, setVercelCacheHit] = useState<string | null>(null);

  const memoizedAttributes = useMemo(
    () => attributes,
    [JSON.stringify(attributes)]
  );

  const getFlag = useCallback(async () => {
    setError(null);
    setMemoryCacheHit(null);
    setVercelCacheHit(null);

    const now = Date.now();
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      const attributes = { ...memoizedAttributes, _flag: flag };

      for (const [k, v] of Object.entries(attributes)) {
        params.set(k, v.toString());
      }
      const res = await fetch(`/api/edge-flags?${params.toString()}`);
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const json = (await res.json()) as { value: boolean };
      setVercelCacheHit(res.headers.get("X-Vercel-Cache"));
      setMemoryCacheHit(res.headers.get("X-Edge-Flags-Cache"));
      setRedisLatency(parseInt(res.headers.get("X-Redis-Latency") ?? "-1"));
      setEdgeLatency(parseInt(res.headers.get("X-Edge-Latency") ?? "-1"));
      setIsEnabled(json.value);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        throw err;
      }
    } finally {
      setLatency(Date.now() - now);
      setIsLoading(false);
    }
  }, [flag, memoizedAttributes]);

  // Only updates when flag or attributes change
  useEffect(() => {
    getFlag();
  }, [getFlag]);

  return {
    isLoading,
    error,
    isEnabled,
    refresh: getFlag,
    debug: {
      latency: {
        total: latency,
        edge: edgeLatency,
        redis: redisLatency,
      },
      cache: {
        vercel: vercelCacheHit,
        memory: memoryCacheHit,
      },
    },
  };
}
