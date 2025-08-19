import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  $isNodeSelection,
  KEY_ESCAPE_COMMAND,
  type LexicalEditor,
  type NodeSelection,
  type RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { Check, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { useFloatingLinkContext } from "@/components/editor/context/floating-link-context"
import { setFloatingElemPosition } from "../utils/set-floating-elem-position"
import { getSelectedNode } from "@/components/editor/utils/get-selected-node"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem,
}: {
  editor: LexicalEditor
  isLink: boolean
  setIsLink: (isLink: boolean) => void
  anchorElem: HTMLElement
}) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setIsLinkEditMode } = useFloatingLinkContext()
  const [linkUrl, setLinkUrl] = useState("")
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | NodeSelection | null
  >(null)

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl("")
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
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect) {
        domRect.y += 40
        setFloatingElemPosition(domRect, editorElem, anchorElem)
      }
      if ($isRangeSelection(selection) || $isNodeSelection(selection)) {
        setLastSelection(selection)
      }
    } else if (!activeElement || activeElement.className !== "link-input") {
      if (rootElement !== null) {
        setFloatingElemPosition(null, editorElem, anchorElem)
      }
      setLastSelection(null)
      setIsLinkEditMode(false)
      setLinkUrl("")
    }

    return true
  }, [anchorElem, editor, setIsLinkEditMode])

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor()
      })
    }

    window.addEventListener("resize", update)

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update)
    }

    return () => {
      window.removeEventListener("resize", update)

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update)
      }
    }
  }, [anchorElem.parentElement, editor, $updateLinkEditor])

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
        COMMAND_PRIORITY_LOW
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
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, $updateLinkEditor, setIsLink, isLink])

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const monitorInputInteraction = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleLinkSubmission()
    } else if (event.key === "Escape") {
      event.preventDefault()
      setIsLinkEditMode(false)
    }
  }

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== "") {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
      }
      setIsLinkEditMode(false)
    }
  }

  return (
    <div ref={editorRef} className="absolute z-20">
      <div
        className={cn(
          "bg-background flex items-center gap-2 rounded-md p-2 shadow-md"
        )}
      >
        <Input
          ref={inputRef}
          value={linkUrl}
          className="h-8"
          onChange={(event) => {
            setLinkUrl(event.target.value)
          }}
          onKeyDown={(event) => {
            monitorInputInteraction(event)
          }}
        />
        <Button
          size={"icon"}
          className="size-8"
          onClick={() => {
            setIsLinkEditMode(false)
          }}
        >
          <X className="size-4" />
        </Button>
        <Button size={"icon"} className="size-8" onClick={handleLinkSubmission}>
          <Check className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement
}) {
  const [editor] = useLexicalComposerContext()
  const { isLinkEditMode } = useFloatingLinkContext()
  const [isLink, setIsLink] = useState(false)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar()
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [editor, $updateToolbar])

  return (
    <>
      {isLinkEditMode &&
        createPortal(
          <FloatingLinkEditor
            editor={editor}
            isLink={isLink}
            anchorElem={anchorElem}
            setIsLink={setIsLink}
          />,
          anchorElem
        )}
    </>
  )
}