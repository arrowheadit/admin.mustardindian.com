import { Editor } from "../blocks/editor-00/editor"
import { type SerializedEditorState } from "lexical"

// eslint-disable-next-line react-refresh/only-export-components
export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

export default function ReachTextEditor({
  editorStateController
}:{
  editorStateController: [SerializedEditorState, (S:SerializedEditorState) => void]
}) {
  const [editorState, setEditorState] = editorStateController

  // useEffect(() => {
    // const editor = createEditor({ nodes: nodes });
    // const parsed = editor.parseEditorState(editorState);

    // parsed.read(() => {
    //   const html = $generateHtmlFromNodes(editor, null);
    //   setEditorContent(html)
    // });
  // })

  return (
    <div>
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
      />
    </div>
  )
}