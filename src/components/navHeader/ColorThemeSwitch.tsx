'use client'

import { useColor } from '@/context/ColorProvider'
import { Switch } from '@headlessui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export default function ColorThemeSwitch() {
  const { isDarkTheme, setIsDarkTheme } = useColor()

  const onSwitch = () => {
    setIsDarkTheme(!isDarkTheme)
    localStorage.theme = isDarkTheme ? 'light' : 'dark'
  }

  return (
    <Switch
      checked={isDarkTheme}
      onChange={onSwitch}
      className={clsx(
        'relative inline-flex h-6 w-10 items-center rounded-full focus-ring',
        isDarkTheme ? 'bg-indigo-500' : 'bg-indigo-200',
      )}
    >
      <span className="sr-only">Enable dark color theme</span>
      <span
        className={clsx(
          'inline-block h-5 w-5 transform transition rounded-full',
          isDarkTheme
            ? 'translate-x-5 bg-black'
            : 'translate-x-0 bg-yellow-300',
        )}
      >
        {isDarkTheme ? (
          <MoonIcon className="w-5 h-5 text-white" aria-hidden="true" />
        ) : (
          <SunIcon className="w-5 h-5 text-black" aria-hidden="true" />
        )}
      </span>
    </Switch>
  )
}
