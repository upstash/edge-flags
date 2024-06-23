"use client";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button, Input } from "antd";
import { useCreateFlag } from "@/api/flags";

export const AddFlagForm = () => {
  const [flagName, setFlagName] = useState<string>("");

  const { mutateAsync: createFlag, isPending } = useCreateFlag();

  return (
    <div className="flex gap-4">
      <Input
        value={flagName}
        onChange={(e) => setFlagName(e.target.value)}
        className="flex-grow"
        placeholder="Flag name"
        disabled={isPending} />
      <Button onClick={async () => {
        await createFlag({ name: flagName });
        setFlagName("");
      }} loading={isPending} disabled={flagName.length === 0} icon={<IconPlus size={20} />} type="primary">
        Add Flag
      </Button>
    </div>
  );
};
