
import { ImageIcon, PlusIcon, X } from "lucide-react"
import { useEditorModal } from "../../editor-hooks/use-modal"
import { Select, SelectContent, SelectGroup, SelectTrigger } from "@/components/ui/select"
import { useState } from "react"
import { Dialog, DialogOverlay, DialogTitle } from "@radix-ui/react-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FileItem } from "@/types/file-manager"
import { useToolbarContext } from "../../context/toolbar-context"
import FileManager from "@/lib/filemanager/dialogs/file-manager"
import { DialogFooter } from "@/components/ui/dialog"
import { INSERT_IMAGE_COMMAND, type InsertImagePayload } from "../images-plugin"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Portal } from "@radix-ui/react-dialog"


export function BlockInsertPlugin({ children }: { children: React.ReactNode }) {
  const [insertImageDialog, setInsertImageDialog] = useState(false)
  const [altText, setAltText] = useState("")
  const [modal] = useEditorModal()


  const [editorImageOpen, setEditorImageOpen] = useState(false)
  const [editorImage, setEditorImage] = useState<Array<Pick<FileItem, 'name' | 'path' | 'url'>>>([])
  const { activeEditor } = useToolbarContext()

  const openFileManager = () => {
    setEditorImageOpen(true)
  }
  
  const handleImageConfirm = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    setInsertImageDialog(false)
  }

  return (
    <>
      {modal}
      <Select value={""}
        onValueChange={(value) => {
          if (value === "image") {
            setInsertImageDialog(true)
          }
        }}
      >
        <SelectTrigger className="!h-8 w-min gap-1">
          <PlusIcon className="size-4" />
          <span>Insert</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>{children}</SelectGroup>
        </SelectContent>
      </Select>

      {insertImageDialog && (
        <Dialog open={insertImageDialog} onOpenChange={(insertImageDialog) => setInsertImageDialog(insertImageDialog)}>
          <Portal>
            <DialogOverlay
            className="fixed inset-0 bg-black/50 z-50 h-full"
            onClick={() => setInsertImageDialog(false)}
          />
          
          
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
            <DialogTitle>Insert Image</DialogTitle>
            {editorImage.length ? (
              <Card className="border">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={editorImage[0].url}
                        alt="Banner preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={() => {
                          setEditorImage([])
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{editorImage[0].name}</span>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => openFileManager()}
                        className="cursor-pointer"
                      >
                        Change Image
                      </Button>
                    </div>

                    {/* Banner Image Alt Text */}
                    <div className="grid gap-2">
                      <Label htmlFor="alt-text">Alt Text</Label>
                      <Input
                        id="alt-text"
                        placeholder="Random unsplash image"
                        onChange={(e) => setAltText(e.target.value)}
                        value={altText}
                        data-test-id="image-modal-alt-text-input"
                      />
                    </div>

                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={`border-2 border-dashed cursor-pointer border-gray-300 mt-2.5`}
                onClick={() => openFileManager()}
              >
                <CardContent className="p-8">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">No banner image selected</p>
                      <Button variant="outline" type="button" className="cursor-pointer" onClick={() => openFileManager()}>
                        Upload Images
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <DialogFooter className="mt-5">
              <Button
                className="cursor-pointer"
                type="button"
                disabled={!editorImage.length}
                onClick={() => handleImageConfirm({ altText, src: editorImage[0].url })}
                data-test-id="image-modal-confirm-btn"
              >
                Confirm
              </Button>
            </DialogFooter>
            </div>
            </Portal>
        </Dialog>
      )}

      {editorImageOpen && (
        <FileManager
          open={editorImageOpen}
          setOpen={setEditorImageOpen}
          selectedFiles={editorImage}
          setSelectedFiles={setEditorImage}
          onSelectCallBack={() => {
            console.log("editorImageOpen hit");
            setEditorImageOpen(false)
          }}
        />
      )}

    </>
  )
}