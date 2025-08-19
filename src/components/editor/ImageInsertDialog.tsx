// components/editor/ImageInsertDialog.tsx
import { useState } from "react"
import { Dialog, DialogOverlay, DialogTitle } from "@radix-ui/react-dialog"
import { ImageIcon, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DialogFooter } from "@/components/ui/dialog"
import FileManager from "@/lib/filemanager/dialogs/file-manager"
import type { FileItem } from "@/types/file-manager"

interface ImageInsertDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (payload: { altText: string; src: string }) => void
}

export default function ImageInsertDialog({
  open,
  onClose,
  onConfirm,
}: ImageInsertDialogProps) {
  const [editorImage, setEditorImage] = useState<Array<Pick<FileItem, 'name' | 'path' | 'url'>>>([])
  const [editorImageOpen, setEditorImageOpen] = useState(false)
  const [altText, setAltText] = useState("")

  const openFileManager = () => {
    setEditorImageOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50 h-full" onClick={onClose} />
        <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <DialogTitle>Insert Image</DialogTitle>
          {editorImage.length ? (
            <Card className="border mt-2">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={editorImage[0].url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setEditorImage([])}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{editorImage[0].name}</span>
                    <Button variant="outline" type="button" onClick={openFileManager}>
                      Change Image
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <Input
                      id="alt-text"
                      placeholder="Random unsplash image"
                      onChange={(e) => setAltText(e.target.value)}
                      value={altText}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed mt-2.5 cursor-pointer border-gray-300" onClick={openFileManager}>
              <CardContent className="p-8 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">No image selected</p>
                <Button variant="outline" type="button" onClick={openFileManager}>
                  Upload Image
                </Button>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="mt-5">
            <Button
              type="button"
              disabled={!editorImage.length}
              onClick={() => {
                onConfirm({ altText, src: editorImage[0].url })
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </Dialog>

      <FileManager
        open={editorImageOpen}
        setOpen={setEditorImageOpen}
        selectedFiles={editorImage}
        setSelectedFiles={setEditorImage}
        onSelectCallBack={() => setEditorImageOpen(false)}
      />
    </>
  )
}
