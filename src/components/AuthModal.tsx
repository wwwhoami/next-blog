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
      <Dialog as="div" className="relative z-50" onClose={router.back}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xl" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="overflow-hidden rounded-2xl bg-slate-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800">
                <Dialog.Title
                  as="h1"
                  className="mb-6 text-3xl font-semibold leading-6 dark:text-white"
                >
                  {title}
                </Dialog.Title>
                <div className="flex shrink justify-center">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AuthModal
