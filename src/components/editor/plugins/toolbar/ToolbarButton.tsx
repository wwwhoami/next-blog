import Button from '@/components/Button'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

type Props = {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>
  icon?: React.ElementType
  children?: React.ReactNode
  tabIndex?: number
  title: string
}

const ToolbarButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      title,
      active,
      disabled,
      onClick,
      onMouseDown,
      icon: Icon,
      tabIndex,
      children,
    },
    ref,
  ) => {
    return (
      <Button
        title={title}
        aria-label={title}
        disabled={disabled}
        onClick={onClick}
        onMouseDown={onMouseDown}
        size="sm"
        variant="text"
        color="secondary"
        className={clsx(
          `p-2`,
          active
            ? 'bg-gray-300/85 dark:bg-gray-600/85 dark:hover:bg-gray-200 dark:focus:bg-gray-200'
            : 'bg-transparent',
        )}
        tabIndex={tabIndex}
        ref={ref}
      >
        {Icon && <Icon className="size-3.5 fill-current" />}
        {children}
      </Button>
    )
  },
)

ToolbarButton.displayName = 'ToolbarButton'

export default ToolbarButton
