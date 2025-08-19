import { useRef, useEffect, useState } from "react";
import { createEditor, type SerializedEditorState, $getRoot } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { nodes } from "@/components/blocks/editor-00/nodes";
import { initialValue } from "@/components/editor/reach-text-editor";

export function wrapIfPlainText(content: string): string {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content.trim());
  return isHtml ? content : `<div>${content}</div>`;
}

export function convertHtmlToSerialized(
  htmlString: string
): SerializedEditorState {
  const editor = createEditor({ nodes });
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, "text/html");

  editor.update(
    () => {
      const parsedNodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      parsedNodes.forEach((node) => root.append(node));
    },
    { discrete: true }
  );

  return editor.getEditorState().toJSON();
}

export function useInputEditorState(
  html: string,
  onContentHtmlChange: (html: string) => void
): [SerializedEditorState, (state: SerializedEditorState) => void] {
  const wrappedHtml = wrapIfPlainText(html);
  const lastHtml = useRef(html);

  const [editorContent, setEditorContent] = useState<SerializedEditorState>(
    () => {
      try {
        return html ? convertHtmlToSerialized(wrappedHtml) : initialValue;
      } catch (e) {
        console.error("Failed to convert HTML to editor state", e);
        return initialValue;
      }
    }
  );

  useEffect(() => {
    const editor = createEditor({ nodes });
    const parsedEditorState = editor.parseEditorState(editorContent);

    parsedEditorState.read(() => {
      const currentHtml = $generateHtmlFromNodes(editor, null);

      // Prevent re-updating if HTML is the same
      if (currentHtml.trim() !== lastHtml.current.trim()) {
        lastHtml.current = currentHtml;
        onContentHtmlChange(currentHtml);
      }
    });
  }, [editorContent, onContentHtmlChange]);

  return [editorContent, setEditorContent];
}
