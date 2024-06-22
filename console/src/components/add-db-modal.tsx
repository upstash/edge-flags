"use client"

import { PropsWithChildren, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Redis } from "@upstash/redis"
import { Input, Modal, Switch } from "antd"
import { Controller, useForm } from "react-hook-form"

import { InputLabel } from "@/components/input-label"
import { useDatabaseStore } from "@/lib/database-store"

type FormValues = {
  url: string
  token: string
  saveToLocalStorage: boolean
  tenant: string
  prefix: string
}

export const AddDatabaseModal = ({ children }: PropsWithChildren) => {
  const [visible, setVisible] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      url: "",
      token: "",
      saveToLocalStorage: true,
      tenant: "",
      prefix: "",
    },
  })

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
      }),
    })

    addDatabase(values)
  }

  return (
    <>
      <div onClick={() => setVisible(true)}>{children}</div>
      <Modal
        confirmLoading={isPending}
        title="Add Database"
        open={visible}
        onOk={handleSubmit(onSubmit)}
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
