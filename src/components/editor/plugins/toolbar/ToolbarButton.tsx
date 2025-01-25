import Button from '@/components/Button'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

type Props = {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  icon?: React.ElementType
  children?: React.ReactNode
  tabIndex?: number
}

const ToolbarButton = forwardRef<HTMLButtonElement, Props>(
  ({ active, disabled, onClick, icon: Icon, tabIndex, children }, ref) => {
    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        size="sm"
        variant="text"
        color="secondary"
        className={clsx(
          `p-2`,
          active
            ? 'bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-200 dark:focus:bg-gray-200'
            : 'bg-transparent',
        )}
        tabIndex={tabIndex}
        ref={ref}
      >
        {Icon && <Icon className="size-3.5" />}
        {children}
      </Button>
    )
  },
)

ToolbarButton.displayName = 'ToolbarButton'

export default ToolbarButton
