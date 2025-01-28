import { MenuItem } from '@headlessui/react'
import React from 'react'

type Props = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  icon?: React.ReactNode
  text: string
  keybinding?: string
}

export default function ToolbarDropDownItem({
  onClick,
  icon,
  text,
  keybinding,
}: Props) {
  return (
    <MenuItem>
      <button
        className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-gray-200 dark:data-[focus]:bg-white/10"
        onClick={onClick}
      >
        {icon && <span className="size-4 opacity-50">{icon}</span>}
        {text}
        {keybinding && (
          <kbd className="ml-auto hidden font-sans text-xs group-data-[focus]:inline">
            {keybinding}
          </kbd>
        )}
      </button>
    </MenuItem>
  )
}
