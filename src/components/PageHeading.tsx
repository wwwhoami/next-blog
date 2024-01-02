type Params = {
  title: string
}

export default function PageHeading({ title }: Params) {
  return (
    <h1 className="my-3 border-b-4 pb-3 text-4xl font-semibold dark:border-gray-300 dark:text-white">
      {title}
    </h1>
  )
}
