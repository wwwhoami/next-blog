import Button from '@/components/Button'
import ModalDialog from '@/components/ModalDialog'
import { CLEAR_EDITOR_COMMAND, LexicalEditor } from 'lexical'
import React from 'react'

type Props = {
  editor: LexicalEditor
  onClose: (value?: boolean) => void
  isOpen: boolean
}

function ClearDialog({ isOpen, editor, onClose }: Props) {
  const clearEditor = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
    editor.focus()

    onClose()
  }

  return (
    <ModalDialog title="Clear Editor" isOpen={isOpen} onClose={onClose}>
      <div className="flex-col space-y-6">
        <p className="block">Are you sure you want to clear the editor?</p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-5">
          <Button color="secondary" width="full" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            className="p-2"
            color="danger"
            width="full"
            onClick={clearEditor}
          >
            Clear
          </Button>
        </div>
      </div>
    </ModalDialog>
  )
}

export default ClearDialog
