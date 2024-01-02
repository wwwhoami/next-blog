type Props = {
  heading: string
  children: React.ReactNode
}

export default function FormCard({ children, heading }: Props) {
  return (
    <div className="fixed inset-0 flex min-h-full items-center justify-center p-4 text-center">
      <div className="overflow-hidden rounded-2xl bg-slate-50 p-6 text-left align-middle shadow-xl dark:bg-slate-800">
        <h1 className="mb-6 text-3xl font-semibold dark:text-white">
          {heading}
        </h1>
        <div className="flex shrink justify-between">{children}</div>
      </div>
    </div>
  )
}
