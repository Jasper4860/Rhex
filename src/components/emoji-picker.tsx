"use client"

import { LevelIcon } from "@/components/level-icon"
import type { MarkdownEmojiItem } from "@/lib/markdown-emoji"
import { cn } from "@/lib/utils"

interface EmojiPickerProps {
  items: Array<Pick<MarkdownEmojiItem, "icon" | "label"> & { key: string; value: string }>
  title?: string
  columns?: number
  className?: string
  panelClassName?: string
  buttonClassName?: string
  iconClassName?: string
  onSelect: (value: string) => void
}

const GRID_COLUMNS_CLASSNAME: Record<number, string> = {
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
}

function resolveColumns(itemCount: number, columns?: number) {
  if (columns) {
    return columns
  }

  if (itemCount >= 24) {
    return 6
  }

  if (itemCount >= 12) {
    return 5
  }

  return 4
}

export function EmojiPicker({
  items,
  title = "选择一个表情",
  columns,
  className,
  panelClassName,
  buttonClassName,
  iconClassName,
  onSelect,
}: EmojiPickerProps) {
  const resolvedColumns = resolveColumns(items.length, columns)
  const gridColumnsClassName = GRID_COLUMNS_CLASSNAME[resolvedColumns] ?? GRID_COLUMNS_CLASSNAME[4]

  return (
    <div className={cn("flex flex-col gap-2", panelClassName)}>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className={cn("grid max-h-80 gap-1.5 overflow-y-auto pr-1", gridColumnsClassName, className)}>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={cn("flex min-h-9 items-center justify-center rounded-xl bg-secondary/40 px-2 py-1.5 text-sm transition hover:bg-accent", buttonClassName)}
            onClick={() => onSelect(item.value)}
            title={item.label}
            aria-label={item.label}
          >
            <LevelIcon
              icon={item.icon}
              title={item.label}
              className={cn("h-5 w-5 text-base leading-none", iconClassName)}
              emojiClassName="leading-none"
              svgClassName="[&>svg]:block [&>svg]:h-full [&>svg]:w-full"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
