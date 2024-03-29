import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { Url } from 'next/dist/shared/lib/router/router'
import Link from 'next/link'
import React from 'react'

type Props = {
  Icon: React.ElementType
  text: string
  href: Url
  scroll?: boolean
}

const MenuItemLink = ({ Icon, text, href, scroll }: Props) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          className={clsx(
            `group flex w-full items-center rounded-md px-2 py-2 text-sm`,
            {
              'bg-indigo-500 text-white': active,
              'text-gray-900 dark:text-slate-100': !active,
            },
          )}
          href={href}
          scroll={scroll}
        >
          {active ? (
            <Icon className="w-5 h-5 mr-2" aria-hidden="true" />
          ) : (
            <Icon className="w-5 h-5 mr-2" aria-hidden="true" />
          )}
          {text}
        </Link>
      )}
    </Menu.Item>
  )
}

export default MenuItemLink
