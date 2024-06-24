"use client"

import { useEffect, useMemo, useState } from "react"
import { FlagData, useFetchFlags } from "@/api/flags"
import { Redis } from "@upstash/redis"
import { Skeleton } from "antd"

import { useDatabaseStore } from "@/lib/database-store"
import { RedisProvider } from "@/hooks/use-redis"
import { EmptyDatabases } from "@/components/empty"
import { FeatureFlag } from "@/components/flag"

import { AddFlagForm } from "../components/add-flag"
import { DatabaseSelector, EnvironmentType } from "../components/select-db"

const FlagEntry = ({ data }: { data: FlagData }) => {
  return <div className="rounded-lg border">{JSON.stringify(data)}</div>
}

const FlagsList = ({ environment }: { environment: EnvironmentType }) => {
  const { data: flags, isLoading } = useFetchFlags()

  if (isLoading) {
    return <Skeleton active />
  }

  return (
    <div className="flex flex-col gap-8">
      {flags
        ?.filter((flag) => flag.environment === environment)
        .map((flag) => <FeatureFlag key={flag.name} flag={flag} environment={environment} />)}
    </div>
  )
}

export default function HydrationWrapper() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    useDatabaseStore.persist.rehydrate()
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  return <Page />
}

function Page() {
  const [selectedDb, setSelectedDb] = useState<string | undefined>()
  const [environment, setEnvironment] = useState<EnvironmentType>("production")

  const { databases } = useDatabaseStore()

  const selectedRedis = useMemo(() => {
    const db = databases.find((db) => db.id === selectedDb)

    if (!db) return

    return new Redis({
      url: db.url,
      token: db.token,
      retry: false,
    })
  }, [databases, selectedDb])

  return (
    <div className="flex justify-center">
      <div className="mt-8 w-full max-w-screen-lg rounded-lg border px-8 py-8">
        {databases.length === 0 ? (
          <EmptyDatabases />
        ) : (
          <div className="flex flex-col gap-8">
            <DatabaseSelector
              selectedDb={selectedDb}
              onSelectDb={setSelectedDb}
              environment={environment}
              setEnvironment={setEnvironment}
            />
            {selectedRedis && (
              <RedisProvider redis={selectedRedis}>
                <AddFlagForm />
                <FlagsList environment={environment} />
              </RedisProvider>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
