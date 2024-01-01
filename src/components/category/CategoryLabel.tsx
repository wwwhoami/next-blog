type Props = {
  hexColor?: string | null
  children: React.ReactNode
}

export default function CategoryLabel({ children, hexColor }: Props) {
  return (
    <div
      className="inline-flex items-center justify-around text-center 
      focus-within:ring focus:outline-none text-sm px-3 py-1.5 font-normal w-auto rounded-lg 
      border-2 bg-transparent focus-ring-secondary border-gray-300 text-gray-700 
      hover:bg-gray-300 hover:text-gray-900 dark:hover:text-gray-900 
      dark:text-gray-100 focus:bg-gray-300 focus:text-gray-900 dark:focus:text-gray-900
      cursor-default group"
      style={{
        ['--tw-ring-color' as any]: hexColor,
        borderColor: hexColor ?? undefined,
      }}
    >
      {children}
    </div>
  )
}
