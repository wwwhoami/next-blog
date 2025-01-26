import React from 'react'
import Error from './Error'

type Props = {}

function Unauthorized({}: Props) {
  return <Error code={401} text="Whoops... Unauthorized for a page :(" />
}

export default Unauthorized
