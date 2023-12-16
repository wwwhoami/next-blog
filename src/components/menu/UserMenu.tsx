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
      <div className="w-10 h-10 ml-3 align-bottom bg-gray-300 rounded-full animate-pulse dark:bg-gray-700">
        <UserCircleIcon className="w-10 h-10 text-gray-700 rounded-full dark:text-gray-100 blur-[2px]" />
      </div>
    )

  return (
    <div className="ml-3 text-right text-gray-700 rounded-full dark:text-gray-100">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="w-10 h-10 align-bottom rounded-full hover-ring focus-ring">
          {user?.image ? (
            <Image
              className="object-center rounded-full"
              src={user.image}
              width={40}
              height={40}
              alt="User avatar"
            />
          ) : (
            <UserCircleIcon className="w-10 h-10 text-gray-700 rounded-full dark:text-gray-100" />
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
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:divide-gray-600 dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
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
            <div className="px-1 py-1 ">
              <SignOut />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
