import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { MATCHERS } from './AutoLinkMatchers'

function PlaygroundAutoLinkPlugin() {
  return <AutoLinkPlugin matchers={MATCHERS} />
}

export default PlaygroundAutoLinkPlugin
