import { NextPage } from 'next'
import Image from 'next/image'

type Props = {}

const NotFoundPage: NextPage<Props> = (props) => {
  return (
    <div className="flex flex-col items-center mt-20">
      <Image src="/images/logo.png" alt="logo" width={140} height={70} />
      <h1 className="my-5 text-6xl dark:text-white">Whoops</h1>
      <h2 className="text-4xl text-gray-400 dark:text-slate-200">
        This page does not exist :(
      </h2>
    </div>
  )
}

export default NotFoundPage
