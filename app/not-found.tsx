import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { NextPage } from 'next'

type Props = {}

const NotFoundPage: NextPage<Props> = (props) => {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="my-5 text-6xl dark:text-white">
        <ExclamationTriangleIcon className="inline-block mx-2 w-14 h-14" />
        404
      </h1>
      <h2 className="text-4xl text-gray-400 dark:text-slate-200">
        Whoops... Page does not exist :(
      </h2>
    </div>
  )
}

export default NotFoundPage
