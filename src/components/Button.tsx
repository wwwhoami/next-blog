import { tv, VariantProps } from 'tailwind-variants'

type ButtonVariants = VariantProps<typeof button>

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonVariants & {}

const button = tv({
  base: 'items-center justify-center text-center focus-within:ring focus:outline-none',
  variants: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-7 py-3.5 text-xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    width: {
      full: 'w-full',
      auto: 'w-auto',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      rounded: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-80',
    },
    variant: {
      outline: 'border-2 bg-transparent',
      solid: '',
    },
    color: {
      primary: 'focus-ring-primary',
      secondary: 'focus-ring-secondary',
      danger: 'focus-ring-danger',
      success: 'focus-ring-success',
    },
  },
  compoundVariants: [
    {
      variant: 'outline',
      color: 'primary',
      className:
        'border-indigo-600 text-indigo-900 hover:bg-indigo-500 hover:text-white focus:bg-indigo-500 focus:text-white dark:text-indigo-50',
    },
    {
      variant: 'outline',
      color: 'secondary',
      className:
        'border-gray-300 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:bg-gray-300 focus:text-gray-900 dark:text-gray-100 dark:hover:text-gray-900 dark:focus:text-gray-900',
    },
    {
      variant: 'outline',
      color: 'danger',
      className:
        'border-red-600 text-red-900 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white dark:text-red-50',
    },
    {
      variant: 'outline',
      color: 'success',
      className:
        'border-green-500 text-green-900 hover:bg-green-400 hover:text-black focus:bg-green-400 focus:text-black dark:text-green-50 dark:hover:text-black dark:focus:text-black',
    },
    {
      variant: 'solid',
      color: 'primary',
      className:
        'bg-indigo-600 text-white hover:bg-indigo-500 focus:bg-indigo-500',
    },
    {
      variant: 'solid',
      color: 'secondary',
      className:
        'bg-gray-300 text-gray-900 hover:bg-gray-300 focus:bg-gray-300',
    },
    {
      variant: 'solid',
      color: 'danger',
      className: 'bg-red-600 text-white hover:bg-red-500 focus:bg-red-500',
    },
    {
      variant: 'solid',
      color: 'success',
      className:
        'bg-green-500 text-black hover:bg-green-400 focus:bg-green-400',
    },
  ],
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    width: 'auto',
    rounded: 'lg',
    variant: 'solid',
    color: 'primary',
  },
})

export default function Button({
  size,
  weight,
  variant,
  color,
  rounded,
  width,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={button({
        size,
        weight,
        rounded,
        width,
        variant,
        color,
        disabled: props.disabled,
        className,
      })}
    >
      {children}
    </button>
  )
}
