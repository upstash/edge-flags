import { useMutation, useQuery } from "@tanstack/react-query"
import { Admin, Environment, Rule } from "@upstash/edge-flags"

import { useRedis } from "@/hooks/use-redis"

import { queryClient } from "./query-client"

export type FlagData = Awaited<ReturnType<(typeof Admin)["prototype"]["getFlag"]>>

export const useFetchFlags = () => {
  const { flags } = useRedis()

  return useQuery({
    queryKey: ["flags-list"],
    queryFn: flags.listFlags.bind(flags),
  })
}

const invalidateFlagsList = () => {
  queryClient.invalidateQueries({
    queryKey: ["flags-list"],
  })
}

export const useCreateFlag = () => {
  const { flags } = useRedis()

  return useMutation({
    mutationFn: flags.createFlag.bind(flags),
    onSuccess: invalidateFlagsList,
  })
}

export const useUpdateFlag = () => {
  const { flags } = useRedis()

  return useMutation({
    mutationFn: async ({
      name,
      environment,
      data,
    }: {
      name: string
      environment: Environment
      data: {
        enabled?: boolean
        rules?: Rule[]
        percentage?: number | null
      }
    }) => flags.updateFlag(name, environment, data),
    onSuccess: invalidateFlagsList,
  })
}

export const useDeleteFlag = () => {
  const { flags } = useRedis()

  return useMutation({
    mutationFn: flags.deleteFlag.bind(flags),
    onSuccess: invalidateFlagsList,
  })
}

export const useRenameFlag = () => {
  const { flags } = useRedis()

  return useMutation({
    mutationFn: ({ oldName, newName }: { oldName: string; newName: string }) =>
      flags.renameFlag(oldName, newName),
    onSuccess: invalidateFlagsList,
  })
}

export const useCopyFlag = () => {
  const { flags } = useRedis()

  return useMutation({
    mutationFn: ({ flagName, newName }: { flagName: string; newName: string }) =>
      flags.copyFlag(flagName, newName),
    onSuccess: invalidateFlagsList,
  })
}

export const useCopyFlagToEnvironment = () => {
  const { flags } = useRedis()

  return useMutation({
    mutationFn: ({
      flagName,
      from,
      to,
    }: {
      flagName: string
      from: Environment
      to: Environment
    }) => flags.copyEnvironment(flagName, from, to),
    onSuccess: invalidateFlagsList,
  })
}
