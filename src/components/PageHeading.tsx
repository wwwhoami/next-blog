type Params = {
  title: string
}

export default function PageHeading({ title }: Params) {
  return (
    <h1 className="pb-3 text-4xl font-semibold border-b-4 dark:border-slate-200 dark:text-white">
      {title}
    </h1>
  )
}