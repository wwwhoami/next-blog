import { Menu } from '@headlessui/react'
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
          className={`${
            active ? 'bg-indigo-500 text-white' : 'text-gray-900'
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
          onClick={onClick}
        >
          {active ? (
            <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
          ) : (
            <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {text}
        </button>
      )}
    </Menu.Item>
  )
}

export default MenuItemButton
