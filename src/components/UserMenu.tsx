import { Menu, Transition } from '@headlessui/react'
import { PencilAltIcon, PlusCircleIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import React, { Fragment } from 'react'
import { useUser } from 'src/context/userContext'
import MenuItem from './MenuItem'
import SignOut from './SignOut'

type Props = {}

const UserMenu = (props: Props) => {
  const { user } = useUser()
  return (
    <div className="px-3 py-2 text-slate-700 rounded-full text-right">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="hover-ring focus-ring w-10 h-10 rounded-full">
          <Image
            className="rounded-full"
            src={user?.user?.image as string}
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
              <MenuItem Icon={PlusCircleIcon} text="Create post" />
              <MenuItem Icon={PencilAltIcon} text="Edit profile" />
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

export default UserMenu
