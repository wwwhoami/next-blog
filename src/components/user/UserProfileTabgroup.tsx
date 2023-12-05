'use client'

import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import PasswordChange from './PasswordChange'
import ProfileEdit from './ProfileEdit'

type Props = {}

const UserProfileTabgroup = ({}: Props) => {
  const tabClassName = ({ selected }: { selected: boolean }) =>
    clsx(
      `focus-ring w-full rounded-lg py-2.5 text-sm font-medium leading-5 focus:ring-opacity-60`,
      selected
        ? 'bg-white shadow dark:bg-slate-600 dark:text-slate-100'
        : 'text-indigo-700 dark:text-indigo-200 dark:hover:bg-white/[0.12] hover:bg-indigo-600/80 hover:text-white',
    )

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 rounded-xl bg-indigo-900/20 dark:bg-indigo-800/80">
          <Tab key="Account" className={tabClassName}>
            Account
          </Tab>
          <Tab key="Password" className={tabClassName}>
            Password
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel
            key="Account"
            className="p-3 focus-ring rounded-xl focus:ring-opacity-60"
          >
            <ProfileEdit />
          </Tab.Panel>
          <Tab.Panel
            key="Password"
            className="p-3 focus-ring rounded-xl focus:ring-opacity-60"
          >
            <PasswordChange />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default UserProfileTabgroup
