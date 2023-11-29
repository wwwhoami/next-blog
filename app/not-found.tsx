import { NextPage } from 'next'
import Image from 'next/image'

type Props = {}

const NotFoundPage: NextPage<Props> = (props) => {
  return (
    <div className="mt-20 flex flex-col items-center">
      <Image src="/images/logo.png" alt="logo" width={140} height={70} />
      <h1 className="my-5 text-6xl">Whoops</h1>
      <h2 className="text-4xl text-gray-400">This page does not exist :(</h2>
    </div>
  )
}

export default NotFoundPage
