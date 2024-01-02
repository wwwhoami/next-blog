type Props = {
  hexColor?: string | null
  children: React.ReactNode
}

export default function CategoryLabel({ children, hexColor }: Props) {
  return (
    <div
      className="focus-ring-secondary group inline-flex w-auto 
      cursor-default items-center justify-around rounded-lg border-2 border-gray-300 bg-transparent px-3 
      py-1.5 text-center text-sm font-normal text-gray-700 
      focus-within:ring hover:bg-gray-300 hover:text-gray-900 
      focus:bg-gray-300 focus:text-gray-900 focus:outline-none dark:text-gray-100
      dark:hover:text-gray-900 dark:focus:text-gray-900"
      style={{
        ['--tw-ring-color' as any]: hexColor,
        borderColor: hexColor ?? undefined,
      }}
    >
      {children}
    </div>
  )
}
