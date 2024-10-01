'use client'

import { useUser } from '@/context/UserProvider'
import { Menu, Transition } from '@headlessui/react'
import {
  PencilIcon,
  PlusCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import { Fragment } from 'react'
import SignOut from '../auth/SignOut'
import MenuItemLink from './MenuItemLink'

type Props = {}

export default function UserMenu(props: Props) {
  const { user, isLoading } = useUser()

  if (isLoading)
    return (
      <div className="ml-3 size-10 animate-pulse rounded-full bg-gray-300 align-bottom dark:bg-gray-700">
        <UserCircleIcon className="size-10 rounded-full text-gray-700 blur-[2px] dark:text-gray-100" />
      </div>
    )

  return (
    <div className="ml-3 rounded-full text-right text-gray-700 dark:text-gray-100">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="hover-ring-primary focus-ring-primary size-10 rounded-full align-bottom">
          {user?.image ? (
            <Image
              className="rounded-full object-center"
              src={user.image}
              width={40}
              height={40}
              alt="User avatar"
            />
          ) : (
            <UserCircleIcon className="size-10 rounded-full text-gray-700 dark:text-gray-100" />
          )}
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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:divide-gray-600 dark:bg-gray-800">
            <div className="p-1 ">
              <MenuItemLink
                Icon={PlusCircleIcon}
                text="Create post"
                href="/new"
                scroll={false}
              />
              <MenuItemLink
                Icon={PencilIcon}
                text="Edit profile"
                href="/user/edit"
                scroll={false}
              />
            </div>
            <div className="p-1 ">
              <SignOut />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
