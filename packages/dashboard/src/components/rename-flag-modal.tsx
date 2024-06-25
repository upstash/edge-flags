"use client"

import { useEffect } from "react"
import { useRenameFlag } from "@/api/flags"
import { Flag } from "@upstash/edge-flags"
import { Input, Modal } from "antd"
import { Controller, useForm } from "react-hook-form"

import { InputLabel } from "@/components/input-label"

type FormValues = {
  name: string
}

export const RenameFlagModal = ({
  selectedFlag,
  onClose,
}: {
  selectedFlag?: Flag
  onClose: () => void
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: selectedFlag?.name,
    },
  })

  useEffect(() => {
    if (selectedFlag) {
      reset({
        name: selectedFlag.name,
      })
    }
  }, [reset, selectedFlag])

  const { mutateAsync: renameFlag, isPending } = useRenameFlag()

  const onSubmit = async (values: FormValues) => {
    if (!selectedFlag) throw new Error("No flag selected")
    await renameFlag({
      oldName: selectedFlag.name,
      newName: values.name,
    })
  }

  return (
    <Modal
      confirmLoading={isPending}
      title="Rename Flag"
      open={selectedFlag !== undefined}
      okText="Rename"
      onOk={handleSubmit(onSubmit)}
      onCancel={onClose}
      centered
    >
      <form className="my-6 flex flex-col gap-4">
        <div>
          <Controller
            control={control}
            name="name"
            rules={{
              required: "This field is required",
              validate: (value) => {
                if (value === selectedFlag?.name) return "New name should be different"
                return true
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                spellCheck={false}
                placeholder="https://my-db.upstash.io"
                autoComplete="off"
              />
            )}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
      </form>
    </Modal>
  )
}
