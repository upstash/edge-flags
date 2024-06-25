import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { IconGripHorizontal, IconTrash } from "@tabler/icons-react"
import { Flag } from "@upstash/edge-flags"
import { Button, Input, Select, Tooltip } from "antd"
import { cx } from "class-variance-authority"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { COUNTRIES } from "@/lib/countries"

export function FeatureFlagRuleList() {
  const { control, watch } = useFormContext<Flag>()

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "rules",
  })

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    move(result.source.index, result.destination.index)
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div ref={droppableProvided.innerRef}>
              {fields.map((item, index) => {
                const rule = watch(`rules.${index}`)
                const accessor = watch(`rules.${index}.accessor`)

                const isCustomAccessor = ![
                  "city",
                  "country",
                  "identifier",
                  "ip",
                  "region",
                ].includes(accessor)

                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, draggableSnapshot) => (
                      <div
                        className={cx(
                          "mb-0.5 flex items-center gap-2 rounded-md bg-gray-50 px-4 py-2",
                          draggableSnapshot.isDragging && "shadow",
                          rule.value && "bg-blue-50"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        {/* handle */}
                        <div
                          className="flex h-8 w-6 items-center justify-center opacity-30"
                          {...provided.dragHandleProps}
                        >
                          <IconGripHorizontal size={20} />
                        </div>

                        {/* content */}
                        <RuleItemAccessor index={index} />
                        {isCustomAccessor && <RuleItemCustomName index={index} />}
                        <RuleItemCompare index={index} />
                        <RuleItemTarget index={index} />
                        <RuleItemValue index={index} />

                        {/* remove */}
                        <div className="flex items-center gap-4">
                          <Tooltip title="Delete">
                            <Button
                              type="text"
                              className="!flex !h-8 !w-8 items-center justify-center !p-0 !text-gray-400"
                              onClick={() => {
                                remove(index)
                              }}
                            >
                              <IconTrash size={20} />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div>
        <Button
          type="dashed"
          className="mt-2 w-full bg-transparent shadow-none"
          onClick={() => {
            append({
              accessor: "country",
              compare: "in",
              target: [],
              value: true,
            })
          }}
        >
          Add Rule
        </Button>
      </div>
    </div>
  )
}

function RuleItemAccessor({ index }: { index: number }) {
  const { control, watch } = useFormContext()

  const accessor = watch(`rules[${index}].accessor`)
  const isCustomAccessor = !["city", "country", "identifier", "ip", "region"].includes(accessor)

  return (
    <div className="flex w-[130px] items-center gap-2">
      <span>If</span>
      <Controller
        name={`rules[${index}].accessor`}
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            options={[
              { label: "City", value: "city" },
              { label: "Country", value: "country" },
              // { label: 'User', value: 'identifier' },
              { label: "IP", value: "ip" },
              { label: "Region", value: "region" },
              {
                label: "Custom",
                value: isCustomAccessor ? accessor : "custom",
              },
            ]}
            {...field}
          />
        )}
      />
    </div>
  )
}

function RuleItemCompare({ index }: { index: number }) {
  const { control } = useFormContext()

  return (
    <div className="w-[160px]">
      <Controller
        name={`rules[${index}].compare`}
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            options={[
              { label: "is in array", value: "in" },
              { label: "is not in array", value: "not_in" },
              { label: "contains", value: "contains" },
              { label: "does not contain", value: "not_contains" },
              { label: "equals", value: "eq" },
              { label: "does not equal", value: "not_eq" },
              { label: "is empty", value: "empty" },
              { label: "is not empty", value: "not_empty" },
              { label: "is greater than", value: "gt" },
              { label: "is greater than or equal", value: "gte" },
              { label: "is less than", value: "lt" },
              { label: "is less than or equal", value: "lte" },
            ]}
            {...field}
          />
        )}
      />
    </div>
  )
}

function RuleItemTarget({ index }: { index: number }) {
  const { control, watch } = useFormContext()

  const accessor = watch(`rules[${index}].accessor`)
  const compare = watch(`rules[${index}].compare`)
  const isCompareArray = ["in", "not_in"].includes(compare)

  return (
    <div className="grow">
      <Controller
        name={`rules[${index}].target`}
        control={control}
        render={({ field }) => {
          return isCompareArray ? (
            <Select
              mode="tags"
              className="w-full"
              options={accessor === "country" ? COUNTRIES : []}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              {...field}
            />
          ) : (
            <Input className="w-full" {...field} />
          )
        }}
      />
    </div>
  )
}

function RuleItemCustomName({ index }: { index: number }) {
  const { control } = useFormContext()

  return (
    <div className="w-[100px]">
      <Controller
        name={`rules[${index}].accessor`}
        control={control}
        render={({ field }) => {
          return <Input className="w-full" {...field} />
        }}
      />
    </div>
  )
}

function RuleItemValue({ index }: { index: number }) {
  const { control } = useFormContext()

  return (
    <div className="flex w-[110px] items-center gap-2">
      <span>then</span>
      <Controller
        name={`rules[${index}].value`}
        control={control}
        render={({ field }) => (
          <Select
            className="w-full"
            options={[
              { label: "On", value: true },
              { label: "Off", value: false },
            ]}
            {...field}
          />
        )}
      />
    </div>
  )
}
