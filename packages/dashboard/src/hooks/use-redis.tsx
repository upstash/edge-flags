import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import { Admin } from "@upstash/edge-flags"
import { Redis } from "@upstash/redis"

const RedisContext = createContext<
  | {
      redis: Redis
      flags: Admin
    }
  | undefined
>(undefined)

export const RedisProvider = ({
  redis,
  children,
  prefix,
  tenant,
}: PropsWithChildren<{
  redis: Redis
  prefix?: string
  tenant?: string
}>) => {
  const flags = useMemo(
    () =>
      new Admin({
        redis: redis,
        prefix,
        tenant,
      }),
    [prefix, redis, tenant]
  )

  return <RedisContext.Provider value={{ redis, flags }}>{children}</RedisContext.Provider>
}

export const useRedis = () => {
  const context = useContext(RedisContext)
  if (!context) {
    throw new Error("useRedis must be used within a RedisProvider")
  }

  return context
}
