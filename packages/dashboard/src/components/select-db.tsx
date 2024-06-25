"use client"

import { useEffect } from "react"
import { IconDots, IconPlus } from "@tabler/icons-react"
import { Button, Dropdown, Modal, Segmented, Select } from "antd"

import { useDatabaseStore } from "@/lib/database-store"

import { AddDatabaseModal } from "./add-db-modal"

export type EnvironmentType = "development" | "preview" | "production"

export const DatabaseSelector = ({
  selectedDb,
  onSelectDb,

  environment,
  setEnvironment,
}: {
  selectedDb?: string
  onSelectDb: (id: string) => void

  environment: EnvironmentType
  setEnvironment: (env: EnvironmentType) => void
}) => {
  const { databases, deleteDatabase } = useDatabaseStore()

  useEffect(() => {
    if (!selectedDb && databases.length > 0) {
      onSelectDb(databases[0].id)
    }
  }, [databases, onSelectDb, selectedDb])

  return (
    <div className="flex justify-between">
      <div className="flex gap-8">
        <div className="flex items-center gap-2 text-sm">
          <div>Database:</div>
          <Select
            placeholder="Select a database"
            value={selectedDb}
            onChange={onSelectDb}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div className="mt-1">
                  <AddDatabaseModal>
                    <Button type="text" icon={<IconPlus size={20} />}>
                      Add Database
                    </Button>
                  </AddDatabaseModal>
                </div>
              </div>
            )}
            options={databases.map((db) => ({
              label: db.url.split("//")[1],
              value: db.id,
            }))}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div>Environment:</div>
          <Segmented
            options={[
              { value: "development", label: "Development" },
              { value: "preview", label: "Preview" },
              { value: "production", label: "Production" },
            ]}
            value={environment}
            onChange={setEnvironment}
          />
        </div>
      </div>

      {selectedDb && (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "remove",
                label: "Remove Database",
                danger: true,
                onClick: () => {
                  Modal.confirm({
                    okText: "Remove",
                    okButtonProps: {
                      danger: true,
                    },
                    centered: true,
                    title: "Remove Database",
                    content:
                      "Removing the database will only delete it from your local storage. You can add it back later.",
                    onOk: () => {
                      deleteDatabase(selectedDb!)
                    },
                  })
                },
              },
            ],
          }}
        >
          <Button icon={<IconDots size={20} />} type="text" />
        </Dropdown>
      )}
    </div>
  )
}
