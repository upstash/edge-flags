import { useState } from "react"
import { useCopyFlag, useCopyFlagToEnvironment, useDeleteFlag } from "@/api/flags"
import { IconDots } from "@tabler/icons-react"
import { Environment, environments, Flag } from "@upstash/edge-flags"
import { Button, Dropdown, Modal } from "antd"

import { capitalizeString } from "./flag"
import { RenameFlagModal } from "./rename-flag-modal"

export const ActionsDropdown = ({
  flag,
  environment,
}: {
  flag: Flag
  environment: Environment
}) => {
  const { mutate: duplicateFlag } = useCopyFlag()
  const { mutate: deleteFlag } = useDeleteFlag()
  const { mutate: copyFlagToEnv } = useCopyFlagToEnvironment()

  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false)

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{
          items: [
            {
              key: "rename",
              label: "Rename",
              onClick: () => {
                setIsRenameModalVisible(true)
              },
            },
            {
              key: "duplicate",
              label: "Duplicate",
              onClick: () => {
                duplicateFlag({
                  flagName: flag.name,
                  newName: flag.name + "-copy",
                })
              },
            },
            {
              type: "divider",
            },
            ...environments
              .filter((env) => env !== environment)
              .map((targetEnv) => ({
                key: "push-" + targetEnv,
                label: `Copy to ${capitalizeString(targetEnv)}`,
                onClick: () => {
                  return Modal.confirm({
                    title: `Are you sure?`,
                    okText: "Copy",
                    content: (
                      <div>
                        Copying to{" "}
                        <code className="rounded-md bg-blue-50 px-1 py-0.5 text-[.8rem] text-blue-500">
                          {targetEnv}
                        </code>{" "}
                        will overwrite any existing configuration.
                      </div>
                    ),
                    onOk: () =>
                      copyFlagToEnv({
                        flagName: flag.name,
                        from: environment,
                        to: targetEnv,
                      }),
                  })
                },
              })),
            {
              type: "divider",
            },
            {
              key: "delete",
              label: "Delete",
              danger: true,
              onClick: () => {
                Modal.confirm({
                  title: "Are you sure delete this flag?",
                  onOk: () => deleteFlag(flag.name),
                  okText: "Delete",
                  okButtonProps: {
                    danger: true,
                  },
                })
              },
            },
          ],
        }}
      >
        <Button type="text" icon={<IconDots className="text-zinc-500" />} />
      </Dropdown>
      <RenameFlagModal
        selectedFlag={isRenameModalVisible ? flag : undefined}
        onClose={() => setIsRenameModalVisible(false)}
      />
    </>
  )
}
