import { VariantProps, tv } from 'tailwind-variants'

const loadingSpinner = tv({
  base: 'inline-block animate-spin',
  variants: {
    size: {
      xs: 'mr-2 -ml-1 size-3',
      sm: 'mr-2 -ml-1 size-4',
      md: 'mr-3 -ml-1 size-5',
      lg: 'mr-3 -ml-1 size-6',
      xl: 'mr-4 -ml-1 size-7',
    },
    color: {
      primary: 'text-indigo-600',
      white: 'text-white',
      black: 'text-black',
      inherit: 'text-inherit',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'inherit',
  },
})

type LoadingSpinnerVariants = VariantProps<typeof loadingSpinner>

type Props = LoadingSpinnerVariants & {}

export default function LoadingSpinner({ size, color }: Props) {
  return (
    <svg
      className={loadingSpinner({ size, color })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
