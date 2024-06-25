import { useEffect, useState } from "react"
import { useRenameFlag, useUpdateFlag } from "@/api/flags"
import { IconTrash } from "@tabler/icons-react"
import { Environment, Flag } from "@upstash/edge-flags"
import { Button, Slider, Switch, Tag, Tooltip } from "antd"
import { cx } from "class-variance-authority"
import { AnimatePresence, motion } from "framer-motion"
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form"

import { ActionsDropdown } from "./flag-dropdown"
import { FeatureFlagRuleList } from "./flag-rules"

export const capitalizeString = (str: string) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

export function FeatureFlag({ flag, environment }: { flag: Flag; environment: Environment }) {
  const defaultValues = {
    ...flag,
  }

  const methods = useForm<Flag>({
    defaultValues,
  })

  const { handleSubmit, reset, formState, control, setValue, watch } = methods

  const percentage = watch("percentage")

  const { mutateAsync: postUpdateFlag, isPending: isUpdating } = useUpdateFlag()

  useEffect(() => {
    reset(flag)
  }, [flag, reset])

  const updateFlag = (partial: Partial<Flag>) => {
    postUpdateFlag({
      name: flag.name,
      environment,
      data: {
        ...flag,
        ...partial,
      },
    })
  }

  const onFormSubmit: SubmitHandler<Flag> = async (data) => updateFlag(data)

  const onFormCancel = () => {
    reset(defaultValues)
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <FormProvider {...methods}>
      <div
        className={cx(
          "relative -mt-px",
          "rounded-lg border border-zinc-200",
          !flag.enabled && "bg-zinc-50",
          isOpen && "z-10 my-2 bg-white shadow-lg"
        )}
      >
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <header className="flex items-center">
            {/* header */}
            <div className="flex grow items-center gap-3">
              <Button
                type="text"
                className="!flex !h-auto w-full items-center justify-start gap-3 bg-transparent !px-6 !py-4 hover:bg-transparent focus:bg-transparent"
                onClick={() => setIsOpen((open) => !open)}
              >
                <span
                  className={cx(
                    "flex h-3 w-3 rounded-full",
                    flag.enabled ? "bg-green-400" : "bg-zinc-300"
                  )}
                />
                <b className="text-base">{flag.name}</b>
                {formState.isDirty && <Tag color="orange">Changes are not saved</Tag>}
              </Button>
            </div>

            {/* meta */}
            <div className="mx-6 flex items-center gap-4">
              {/* percentage */}
              {flag.percentage !== null && (
                <Tooltip title={<PercentageInfo value={percentage!} />}>
                  <b
                    className={cx(
                      "rounded-md bg-zinc-50 px-2 py-0.5",
                      "lining-nums text-zinc-400",
                      flag.enabled && "bg-blue-50 text-blue-600"
                    )}
                  >
                    {flag.percentage}%
                  </b>
                </Tooltip>
              )}
              {/* enabled */}
              <Switch
                className={cx(flag.enabled && "bg-green-400")}
                loading={isUpdating}
                checked={flag.enabled}
                onChange={(checked) => {
                  updateFlag({
                    enabled: checked,
                  })
                }}
              />

              <ActionsDropdown environment={environment} flag={flag} />
            </div>
          </header>

          {/* ------------------------------------------------------------ */}

          {/* rules */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial="collapsed"
                animate="open"
                exit="collapsed"
                transition={{
                  duration: "0.13",
                }}
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
              >
                <div className="p-6">
                  {/* percentage */}
                  <div className="rounded-lg bg-zinc-50 p-4">
                    <h5 className="text-sm uppercase text-zinc-500">Percentage</h5>

                    <div>
                      {percentage === null ? (
                        <div className="mt-4">
                          <Button
                            type="dashed"
                            className="mt-2 w-full bg-transparent shadow-none"
                            onClick={() => {
                              setValue("percentage", 50, {
                                shouldDirty: true,
                              })
                            }}
                          >
                            Set percentage
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <div>
                            <PercentageInfo value={percentage} />
                          </div>
                          <div className="mt-4 flex items-center gap-4 rounded-md bg-blue-50 px-4 py-2">
                            <div className="grow">
                              <Controller
                                name="percentage"
                                control={control}
                                render={({ field }) => (
                                  // @ts-ignore
                                  <Slider
                                    className="edge-flags-percentage-slider"
                                    tooltip={{
                                      formatter: (value) => value && `${value}%`,
                                    }}
                                    {...field}
                                  />
                                )}
                              />
                            </div>
                            <Tooltip title="Remove percentage">
                              <Button
                                type="text"
                                className="!flex !h-8 !w-8 items-center justify-center !p-0 !text-zinc-400"
                                onClick={() => {
                                  setValue("percentage", null, {
                                    shouldDirty: true,
                                  })
                                }}
                              >
                                <IconTrash size={20} />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* rules */}
                  <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                    <h5 className="text-sm uppercase text-zinc-500">Rules</h5>
                    <div className="mt-4">
                      <FeatureFlagRuleList />
                    </div>
                  </div>

                  {/* footer */}
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button onClick={onFormCancel} disabled={!formState.isDirty}>
                      Discard Changes
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isUpdating}
                      disabled={!formState.isDirty}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </FormProvider>
  )
}

function PercentageInfo({ value }: { value: number }) {
  return (
    <>
      <span className="lining-nums">{value}%</span> of the traffic will be evaluated. The remaining
      will get false.
    </>
  )
}
