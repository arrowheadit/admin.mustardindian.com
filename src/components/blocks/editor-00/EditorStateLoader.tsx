import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import type { SerializedEditorState } from "lexical";

export function EditorStateLoader({
  initialSerializedState,
}: {
  initialSerializedState: SerializedEditorState;
}) {
  const [editor] = useLexicalComposerContext();
  const lastStateRef = useRef<SerializedEditorState | null>(null);

  useEffect(() => {
    if (!initialSerializedState) return;

    if (JSON.stringify(initialSerializedState) !== JSON.stringify(lastStateRef.current)) {
      const newEditorState = editor.parseEditorState(initialSerializedState);
      editor.setEditorState(newEditorState);
      lastStateRef.current = initialSerializedState;
    }
  }, [editor, initialSerializedState]);

  return null;
}
