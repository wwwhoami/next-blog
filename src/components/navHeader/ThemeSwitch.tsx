'use client'

import { useTheme } from '@/context/ThemeProvider'
import { Switch } from '@headlessui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export default function ThemeSwitch() {
  const { isDarkTheme, changeTheme } = useTheme()

  const onSwitch = () => {
    changeTheme(!isDarkTheme)
  }

  return (
    <Switch
      checked={isDarkTheme}
      onChange={onSwitch}
      className={clsx(
        'relative inline-flex h-6 w-10 items-center rounded-full focus-ring',
        isDarkTheme ? 'bg-gray-700/80' : 'bg-indigo-600',
      )}
    >
      <span className="sr-only">Enable dark color theme</span>
      <span
        className={clsx(
          'inline-block h-5 w-5 transform transition rounded-full bg-gray-50',
          isDarkTheme ? 'translate-x-5' : 'translate-x-0',
        )}
      >
        {isDarkTheme ? (
          <MoonIcon className="w-5 h-5 text-gray-700/80" aria-hidden="true" />
        ) : (
          <SunIcon className="w-5 h-5 text-indigo-600" aria-hidden="true" />
        )}
      </span>
    </Switch>
  )
}
