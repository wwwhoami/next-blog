import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import React, { Fragment } from 'react'

type Props = {
  title?: string
  isOpen?: boolean
  children: React.ReactNode
  onClose: (value?: boolean) => void
}

function ModalDialog({ title, children, isOpen, onClose }: Props) {
  return (
    <Transition show={isOpen} appear as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xl" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="overflow-hidden rounded-2xl bg-slate-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-800">
                <DialogTitle
                  as="h1"
                  className="mb-6 text-3xl font-semibold leading-6 dark:text-white"
                >
                  {title}
                </DialogTitle>
                <div className="flex shrink justify-center">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalDialog
