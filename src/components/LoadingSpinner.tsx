import { VariantProps, tv } from 'tailwind-variants'

const loadingSpinner = tv({
  base: 'inline-block animate-spin',
  variants: {
    size: {
      xs: '-ml-1 mr-2 size-3',
      sm: '-ml-1 mr-2 size-4',
      md: '-ml-1 mr-3 size-5',
      lg: '-ml-1 mr-3 size-6',
      xl: '-ml-1 mr-4 size-7',
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
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
