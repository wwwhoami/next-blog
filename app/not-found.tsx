import Error from '@/components/Error'
import { NextPage } from 'next'

type Props = {}

const NotFoundPage: NextPage<Props> = (props) => {
  return <Error code={404} text="Whoops... Page does not exist :(" />
}

export default NotFoundPage
