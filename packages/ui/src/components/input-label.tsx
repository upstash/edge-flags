"use client"

import { cx } from "class-variance-authority"

export const InputLabel = ({
  children,
  optional,
  className,
}: {
  children: React.ReactNode
  optional?: boolean
  className?: string
}) => {
  return (
    <label className={cx("block text-sm font-medium text-zinc-950", className)}>
      {children}
      {optional && <span className="ml-2 font-normal text-gray-400">{"(optional)"}</span>}
    </label>
  )
}
