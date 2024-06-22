"use client"

import { IconPlus } from "@tabler/icons-react"
import { Button, Empty } from "antd"

import { AddDatabaseModal } from "./add-db-modal"

export const EmptyDatabases = () => {
  return (
    <Empty
      className="!mt-0 min-h-[260px] rounded-lg bg-zinc-50 p-14"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      style={{
        marginInline: 0,
      }}
      imageStyle={{
        height: 80,
      }}
      description={
        <div className="mx-auto mt-[-8px] max-w-screen-sm text-gray-600">
          <p className="text-md text-black">No databases added yet</p>
        </div>
      }
    >
      <div className="mt-4 flex justify-center">
        <AddDatabaseModal>
          <Button type="primary" icon={<IconPlus size={20} />} className="!flex !items-center">
            Add a Database
          </Button>
        </AddDatabaseModal>
      </div>
    </Empty>
  )
}
