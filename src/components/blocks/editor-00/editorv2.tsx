import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

import { nodes } from "./nodes"
import { Plugins } from "./plugins"
import { SharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context"
import { EditorStateLoader } from "./EditorStateLoader"
import type { EditorState, SerializedEditorState } from "lexical";
const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

export function Editorv2({
  editorSerializedState,
  onChange,
  onSerializedChange,
}: {
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  const composerKey = JSON.stringify(editorSerializedState); // ✅ Force full reinit

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer key={composerKey} initialConfig={editorConfig}>
        <TooltipProvider>
          <SharedAutocompleteContext>
            <Plugins />
            {editorSerializedState ? (
              <EditorStateLoader initialSerializedState={editorSerializedState} />
            ) : null}
          </SharedAutocompleteContext>
          <OnChangePlugin
            ignoreSelectionChange
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}


