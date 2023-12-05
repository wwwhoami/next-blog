'use client'

import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { FC, Fragment, ReactNode } from 'react'

type Props = {
  title?: string
  children: ReactNode
}

const AuthModal: FC<Props> = ({ title, children }) => {
  const router = useRouter()

  return (
    <Transition show appear as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={router.back}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xl backdrop-filter" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-md p-6 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl bg-slate-50 dark:bg-slate-800">
                <Dialog.Title
                  as="h1"
                  className="text-3xl font-semibold leading-6 dark:text-white"
                >
                  {title}
                </Dialog.Title>
                <div className="flex flex-wrap justify-between mt-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AuthModal
