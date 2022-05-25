import React, {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import FocusLock from 'react-focus-lock'

type Props = {
  isShown: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Modal = ({ isShown, onClose, title, children }: Props) => {
  const [isBrowser, setIsBrowser] = useState(false)

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isShown) {
        onClose()
      }
    },
    [isShown, onClose]
  )

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  useEffect(() => {
    isShown
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'unset')

    document.addEventListener('keydown', onKeyDown, false)

    return () => {
      document.removeEventListener('keydown', onKeyDown, false)
    }
  }, [isShown, onKeyDown])

  const handleClose = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClose()
  }

  const modalContent = isShown && (
    <FocusLock>
      <div
        className="fixed top-0 left-0 w-full h-screen flex justify-center items-center backdrop-filter backdrop-blur-xl"
        onClick={onClose}
      >
        <div
          className="bg-slate-100 w-fit h-fit rounded-2xl p-5 z-50"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="flex justify-between">
            {title && <h1 className="font-semibold text-xl">{title}</h1>}
            <a href="#" onClick={handleClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </a>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </FocusLock>
  )

  return isBrowser
    ? createPortal(modalContent, document.getElementById('modal-root')!)
    : null
}

export default Modal
