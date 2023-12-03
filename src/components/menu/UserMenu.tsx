'use client'

import { Menu, Transition } from '@headlessui/react'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { Fragment } from 'react'
import { useUser } from 'src/context/UserContext'
import SignOut from '../auth/SignOut'
import MenuItemButton from './MenuItemButton'
import MenuItemLink from './MenuItemLink'

type Props = {}

export default function UserMenu(props: Props) {
  const { user } = useUser()

  return (
    <div className="rounded-full px-3 py-2 text-right text-slate-700">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="hover-ring focus-ring h-10 w-10 rounded-full align-bottom">
          <Image
            className="rounded-full object-center"
            src={user?.image ?? ''}
            width={40}
            height={40}
            alt="User avatar"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <MenuItemButton Icon={PlusCircleIcon} text="Create post" />
              <MenuItemLink
                Icon={PencilIcon}
                text="Edit profile"
                href="/user/edit"
                scroll={false}
              />
            </div>
            <div className="px-1 py-1 ">
              <SignOut />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}