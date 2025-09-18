import Button from '@/components/Button'
import {
  CheckCircleIcon,
  LinkSlashIcon,
  NoSymbolIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getSelectedNode, sanitizeUrl } from '../utils'

const VERITCAL_GAP = 10
const HORITZONTAL_GAP = 10

/**
 * Positions the floating editor element relative to the target element.
 * @param {DOMRect | null} targetRect - The bounding rectangle of the target element.
 * @param {HTMLElement} floatingElem - The floating editor element.
 * @param {number} [verticalGap=VERITCAL_GAP] - The vertical gap between the target and floating elements.
 * @param {number} [horizontalGap=HORITZONTAL_GAP] - The horizontal gap between the target and floating elements.
 */
function positionFloatingElement(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  verticalGap: number = VERITCAL_GAP,
  horizontalGap: number = HORITZONTAL_GAP,
) {
  if (targetRect === null) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
  } else {
    floatingElem.style.opacity = '1'
    let top = targetRect.top + targetRect.height + window.scrollY + verticalGap
    let left =
      targetRect.left +
      window.scrollX -
      floatingElem.offsetWidth / 2 +
      targetRect.width / 2

    // Adjust if the editor overflows the viewport
    const floatingElemRect = floatingElem.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 0) {
      left = horizontalGap
    } else if (left + floatingElemRect.width > viewportWidth) {
      left = viewportWidth - floatingElemRect.width - horizontalGap
    }

    if (top < 0) {
      top = verticalGap
    } else if (top + floatingElemRect.height > viewportHeight) {
      top = viewportHeight - floatingElemRect.height - verticalGap
    }

    floatingElem.style.transform = `translate(${left}px, ${top}px)`
  }
}

type Props = {
  editor: LexicalEditor
  isLink: boolean
  setIsLink: Dispatch<boolean>
  isEditMode: boolean
  setIsEditMode: Dispatch<boolean>
}

/**
 * FloatingLinkEditor component provides a floating toolbar for editing links in the Lexical editor.
 * @param {Object} props - The properties object.
 * @param {LexicalEditor} props.editor - The Lexical editor instance.
 * @param {boolean} props.isLink - Indicates if the current selection is a link.
 * @param {Dispatch<boolean>} props.setIsLink - Function to set the isLink state.
 * @param {boolean} props.isEditMode - Indicates if the editor is in edit mode.
 * @param {Dispatch<boolean>} props.setIsEditMode - Function to set the isEditMode state.
 * @returns {JSX.Element} The FloatingLinkEditor component.
 */
function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  isEditMode,
  setIsEditMode,
}: Props): JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [linkUrl, setLinkUrl] = useState('')
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://')
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode)

      if (linkParent) {
        setLinkUrl(linkParent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }

      if (isEditMode) {
        setEditedLinkUrl(linkUrl)
      }
    }

    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement()

    if (
      selection !== null &&
      nativeSelection !== null &&
      // !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect()

      if (domRect) {
        positionFloatingElement(domRect, editorElem)
      }
      setLastSelection(selection)
    } else if (!activeElement) {
      if (rootElement !== null) {
        positionFloatingElement(null, editorElem)
      }

      setLastSelection(null)
      setIsEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [editor, isEditMode, linkUrl, setIsEditMode])

  const handleLinkSubmission = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
  ) => {
    e.preventDefault()

    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.update(() => {
          editor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl(editedLinkUrl),
          )
          const selection = $getSelection()

          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent()
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              })
              parent.replace(linkNode, true)
            }
          }
        })
      }
      setEditedLinkUrl('https://')
      setIsEditMode(false)
    }
  }

  const handleLinkSubmissionDiscard = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
  ) => {
    e.preventDefault()
    setIsEditMode(false)
  }

  const monitorKeyboardInteraction = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      if (lastSelection !== null) {
        handleLinkSubmission(e)
      }
    } else if (e.key === 'Escape') {
      handleLinkSubmissionDiscard(e)
    }
  }

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [editor, $updateLinkEditor, isLink, setIsLink])

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditMode, isLink])

  return (
    <div
      ref={editorRef}
      className="absolute top-0 left-0 z-10 max-w-96 transform-gpu opacity-0 transition-transform will-change-transform"
    >
      {!isLink ? null : isEditMode ? (
        <div className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200/70 bg-gray-100 p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200 dark:placeholder:text-gray-400 dark:autofill:bg-slate-800 dark:autofill:text-gray-200 dark:focus-within:ring-indigo-600/80">
          <input
            ref={inputRef}
            className="h-6 rounded-xl border-2 border-gray-200/70 bg-gray-100 p-2 shadow-lg focus-ring-primary dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200 dark:placeholder:text-gray-400 dark:autofill:bg-slate-800 dark:autofill:text-gray-200 dark:focus-within:ring-indigo-600/80"
            value={editedLinkUrl}
            onChange={(e) => {
              setEditedLinkUrl(e.target.value)
            }}
            onBlur={() => {
              setIsEditMode(false)
            }}
            onKeyDown={monitorKeyboardInteraction}
          />

          <Button
            onClick={handleLinkSubmissionDiscard}
            size="sm"
            variant="text"
            color="secondary"
            className="bg-gray-200 p-2 dark:bg-gray-700 dark:hover:bg-gray-200 dark:focus:bg-gray-200"
          >
            <NoSymbolIcon className="size-3.5 fill-current" />
          </Button>
          <Button
            onClick={handleLinkSubmission}
            size="sm"
            variant="text"
            color="secondary"
            className="bg-gray-200 p-2 dark:bg-gray-700 dark:hover:bg-gray-200 dark:focus:bg-gray-200"
          >
            <CheckCircleIcon className="size-3.5 fill-current" />
          </Button>
        </div>
      ) : (
        <>
          <div className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200/70 bg-gray-100 p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200 dark:placeholder:text-gray-400 dark:autofill:bg-slate-800 dark:autofill:text-gray-200 dark:focus-within:ring-indigo-600/80">
            <a
              href={sanitizeUrl(linkUrl)}
              className="inline-block max-w-60 overflow-hidden rounded-xl font-medium text-indigo-600 focus-ring-primary hover:underline dark:text-indigo-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkUrl}
            </a>
            <Button
              onClick={(e) => {
                e.preventDefault()
                setEditedLinkUrl(linkUrl)
                setIsEditMode(true)
              }}
              size="sm"
              variant="text"
              color="secondary"
              className="bg-gray-200 p-2 dark:bg-gray-700 dark:hover:bg-gray-200 dark:focus:bg-gray-200"
            >
              <PencilIcon className="size-3.5 fill-current" />
            </Button>
            <Button
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
              }}
              size="sm"
              variant="text"
              color="secondary"
              className="bg-gray-200 p-2 dark:bg-gray-700 dark:hover:bg-gray-200 dark:focus:bg-gray-200"
            >
              <LinkSlashIcon className="size-3.5 fill-current" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * useFloatingLinkEditorToolbar hook provides the floating link editor toolbar for the Lexical editor.
 * @param {LexicalEditor} editor - The Lexical editor instance.
 * @param {HTMLElement} anchorElem - The anchor element for the floating toolbar.
 * @param {boolean} isLinkEditMode - Indicates if the link editor is in edit mode.
 * @param {Dispatch<boolean>} setIsLinkEditMode - Function to set the isLinkEditMode state.
 * @returns {JSX.Element | null} The floating link editor toolbar component.
 */
function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>,
): JSX.Element | null {
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLink, setIsLink] = useState(false)

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode,
        )
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false)
          return
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode)
            const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)
            return (
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              (linkNode && !linkNode.is(focusLinkNode)) ||
              (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
              (autoLinkNode &&
                (!autoLinkNode.is(focusAutoLinkNode) ||
                  autoLinkNode.getIsUnlinked()))
            )
          })
        if (!badNode) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      }
    }
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar()
          setActiveEditor(newEditor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      setIsLink={setIsLink}
      isEditMode={isLinkEditMode}
      setIsEditMode={setIsLinkEditMode}
    />,
    anchorElem,
  )
}

function FloatingLinkEditorPlugin({
  anchorElem = document.body,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  anchorElem?: HTMLElement
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  return useFloatingLinkEditorToolbar(
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode,
  )
}

export default FloatingLinkEditorPlugin
