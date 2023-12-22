type Props = {
  heading: string
  children: React.ReactNode
}

export default function FormCard({ children, heading }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-full p-4 text-center">
      <div className="p-6 overflow-hidden text-left align-middle shadow-xl rounded-2xl bg-slate-50 dark:bg-slate-800">
        <h1 className="mb-6 text-3xl font-semibold dark:text-white">
          {heading}
        </h1>
        <div className="flex justify-between flex-shrink">{children}</div>
      </div>
    </div>
  )
}
