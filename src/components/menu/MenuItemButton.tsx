import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'

type Props = {
  Icon: React.ElementType
  text: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const MenuItemButton = ({ Icon, text, onClick }: Props) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={clsx(
            `group flex w-full items-center rounded-md p-2 text-sm`,
            active
              ? 'bg-indigo-500 text-white'
              : 'text-gray-900 dark:text-slate-100',
          )}
          onClick={onClick}
        >
          {active ? (
            <Icon className="mr-2 size-5" aria-hidden="true" />
          ) : (
            <Icon className="mr-2 size-5" aria-hidden="true" />
          )}
          {text}
        </button>
      )}
    </Menu.Item>
  )
}

export default MenuItemButton
