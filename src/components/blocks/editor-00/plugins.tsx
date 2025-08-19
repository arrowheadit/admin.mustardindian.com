import { useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list"
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote"
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin"
import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "@/components/editor/plugins/toolbar/font-background-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin"
import { ClearEditorActionPlugin } from "@/components/editor/plugins/actions/clear-editor-plugin"
import { CounterCharacterPlugin } from "@/components/editor/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from "@/components/editor/plugins/actions/edit-mode-toggle-plugin"
import { ImportExportPlugin } from "@/components/editor/plugins/actions/import-export-plugin"
import { MaxLengthPlugin } from "@/components/editor/plugins/actions/max-length-plugin"
import { SpeechToTextPlugin } from "@/components/editor/plugins/actions/speech-to-text-plugin"
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin"
import { InsertTable } from "@/components/editor/plugins/toolbar/block-insert/insert-table"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import {
  TableContext,
  TablePlugin as NewTablePlugin,
} from "@/components/editor/plugins/table-plugin"
import { TableHoverActionsPlugin } from "@/components/editor/plugins/table-hover-actions-plugin"
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin"
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image"
import { InsertColumnsLayout } from "@/components/editor/plugins/toolbar/block-insert/insert-columns-layout"
import { LayoutPlugin } from "@/components/editor/plugins/layout-plugin"

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)
    
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {() => (
          <div className="vertical-align-middle sticky top-0 z-10 flex flex-wrap gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
            <FontFamilyToolbarPlugin />
            <FontSizeToolbarPlugin />
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
            <ElementFormatToolbarPlugin />
            <SubSuperToolbarPlugin />
            <LinkToolbarPlugin />
            <ClearFormattingToolbarPlugin />
            <FontColorToolbarPlugin />
            <FontBackgroundToolbarPlugin />
            <BlockInsertPlugin>
              {/* <InsertEmbeds /> */}
              <InsertTable />
              <InsertImage />
              <InsertColumnsLayout />
            </BlockInsertPlugin>
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <TableContext>
          <>
            <NewTablePlugin
              cellEditorConfig={{
                namespace: "table-cell",
                nodes: [],
                onError: (error) => {
                  throw error
                },
                readOnly: false,
                theme: {
                  // TODO:
                },
              }}
            >
              <></>
            </NewTablePlugin>
            <TablePlugin />
            <TableHoverActionsPlugin anchorElem={floatingAnchorElem!} />
            <RichTextPlugin
              contentEditable={
                <div className="">
                  <div className="" ref={onRef}>
                    <ContentEditable placeholder={"Start typing ..."} />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ImagesPlugin />
            <LayoutPlugin />
          </>
        </TableContext>
        {/* editor plugins */}
      </div>
      {/* actions plugins */}
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
            <MaxLengthPlugin maxLength={1500} />
          </div>
          <div>
            {/* center action buttons */}
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            {/* right side action buttons */}
            <SpeechToTextPlugin />
            <ImportExportPlugin />
            {/* <MarkdownTogglePlugin transformers={} shouldPreserveNewLinesInMarkdown={true} /> */}
            <EditModeTogglePlugin />
            <ClearEditorActionPlugin />
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}
