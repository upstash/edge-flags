"use client"

import { PropsWithChildren, useState } from "react"
import { getCredentials } from "@/server/credentials"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Redis } from "@upstash/redis"
import { Input, Modal, Switch } from "antd"
import { Controller, useForm } from "react-hook-form"

import { useDatabaseStore } from "@/lib/database-store"
import { InputLabel } from "@/components/input-label"

type FormValues = {
  url: string
  token: string
  saveToLocalStorage: boolean
  tenant: string
  prefix: string
}

export const AddDatabaseModal = ({ children }: PropsWithChildren) => {
  const [visible, setVisible] = useState(false)

  const { data: defaultCredentials } = useQuery({
    queryKey: ["default-credentials"],
    queryFn: async () => {
      return await getCredentials()
    },
  })

  const defaultValues = {
    url: defaultCredentials?.url ?? "",
    token: defaultCredentials?.token ?? "",
    saveToLocalStorage: true,
    tenant: "",
    prefix: "",
  }

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues,
  })

  const isFromDefault =
    watch("url") === defaultCredentials?.url && watch("token") === defaultCredentials?.token

  const { mutateAsync: pingDb, isPending } = useMutation({
    mutationFn: async ({ redis }: { redis: Redis }) => {
      await redis.ping()
    },
  })

  const { addDatabase } = useDatabaseStore()

  const onSubmit = async (values: FormValues) => {
    await pingDb({
      redis: new Redis({
        url: values.url,
        token: values.token,
        retry: false,
      }),
    })

    addDatabase(values)
  }

  return (
    <>
      <div
        onClick={() => {
          setVisible(true)
          reset(defaultValues)
        }}
      >
        {children}
      </div>
      <Modal
        confirmLoading={isPending}
        title="Add Database"
        open={visible}
        onOk={handleSubmit(onSubmit)}
        okText={isPending ? "Pinging db..." : "Add"}
        onCancel={() => setVisible(false)}
        centered
      >
        <form className="my-6 flex flex-col gap-4">
          <div>
            <InputLabel className="mb-1">Endpoint</InputLabel>

            <Controller
              control={control}
              name="url"
              rules={{
                required: "This field is required",
                validate: (value) => value.startsWith("https://") || "URL must start with https://",
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="url"
                  spellCheck={false}
                  placeholder="https://my-db.upstash.io"
                  autoComplete="off"
                />
              )}
            />
            {errors.url && <span className="text-xs text-red-500">{errors.url.message}</span>}
          </div>

          <div>
            <InputLabel className="mb-1">Token</InputLabel>

            <Controller
              control={control}
              name="token"
              render={({ field }) => (
                <Input {...field} spellCheck={false} placeholder="*****" autoComplete="off" />
              )}
              rules={{
                required: "This field is required",
              }}
            />
            {errors.token && <span className="text-xs text-red-500">{errors.token.message}</span>}
          </div>

          {isFromDefault && (
            <div className="text-amber-600">These credentials were taken from the .env file</div>
          )}

          <div>
            <InputLabel optional className="mb-1">
              Tenant
            </InputLabel>

            <Controller
              control={control}
              name="tenant"
              render={({ field }) => <Input {...field} placeholder="default" />}
            />
          </div>

          <div>
            <InputLabel optional className="mb-1">
              Prefix
            </InputLabel>
            <Controller
              control={control}
              name="prefix"
              render={({ field }) => <Input {...field} placeholder="" />}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Controller
              control={control}
              name="saveToLocalStorage"
              render={({ field }) => <Switch className="block" size="small" {...field} />}
            />
            <InputLabel>Save to local storage</InputLabel>
          </div>
        </form>
      </Modal>
    </>
  )
}
