import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogOverlay, DialogTitle } from "@radix-ui/react-dialog";
import { Upload, Grid, List, X, ImageIcon, FileText, File, CheckCircle } from "lucide-react";
import { useFileManager } from "@/context/hooks";
import FolderTree from "../folder-tree";
import CreateRootFolder from "../create-root-folder";
import { MultiSelectDropZone } from "../ui/multiSelect-drop-zone";
import type { FileItem } from "@/types/file-manager";
import { Portal } from "@radix-ui/react-dialog"

type FileManagerProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedFiles: Array<Pick<FileItem, 'name' | 'path' | 'url'>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<Pick<FileItem, "name" | "path" | "url">[]>>;
  onSelectCallBack: () => void;
  multiple?: boolean;
};

export default function FileManager({
  open,
  setOpen,
  multiple = false,
  selectedFiles,
  setSelectedFiles,
  onSelectCallBack
}: FileManagerProps) {
  const {
    activeFolderPath,
    files,
    viewMode,
    setViewMode,
    openUploader,
    setOpenUploader,
  } = useFileManager()

  function getFileIcon(type: string) {
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8 text-gray-400" />;
    if (type === "application/pdf") return <FileText className="h-8 w-8 text-red-600" />;
    if (type.startsWith("text/")) return <FileText className="h-8 w-8 text-gray-600" />;
    return <File className="h-8 w-8 text-gray-500" />;
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function toggleFileSelection(file: Pick<FileItem, 'name' | 'path' | 'url'>) {
    if (multiple) {
      setSelectedFiles(prev =>
        prev.find(f => f.path === file.path)
          ? prev.filter(f => f.path !== file.path)
          : [...prev, file]
      );
    } else {
      setSelectedFiles([file]);
    }
  }


  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Portal>
        
      <DialogOverlay
        className="fixed inset-0 bg-black/50 z-50 h-full"
        onClick={() => setOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-xl font-semibold">File Manager</DialogTitle>

          <div className="flex gap-2">
            {/* View toggle buttons */}
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size={"sm"}
                className={`cursor-pointer p-1.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size={"sm"}
                className={`cursor-pointer p-1.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 border rounded-md">
          {/* Folder sidebar */}
          <div
            className="col-span-4 h-[450px] overflow-y-auto border-r p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            tabIndex={0}
            onWheel={(e) => {
              e.currentTarget.scrollTop += e.deltaY;
            }}
          >
            <div className="min-w-[200px] overflow-auto">
              {/* Root level new folder input or button */}
              <CreateRootFolder />

              {/* Folder tree */}
              <FolderTree />
            </div>
          </div>

          {/* File content area */}
          <div className="col-span-8 p-3 relative">
            {/* Floating Upload Button */}
            {activeFolderPath && (
              <Button
                size="sm"
                variant="default"
                className="fixed bottom-[100px] right-14 rounded-full w-12 h-12 shadow-md flex items-center justify-center p-0 z-50 bg-blue-600 hover:bg-blue-700"
                title="Upload Files"
                onClick={() => setOpenUploader(!openUploader)}
              >
                {openUploader ? <X className="h-5 w-5 text-white" /> : <Upload className="h-5 w-5 text-white" />}
              </Button>
            )}
            {openUploader ? (
              <MultiSelectDropZone
                maxFileSize={5}
                acceptedFileTypes="image/*,application/pdf"
                folderPath={activeFolderPath}
              />
            ) : (
              <>
                {viewMode === "list" && (
                  <div
                    className="overflow-auto max-h-[420px]"
                    onWheel={(e) => {
                      e.currentTarget.scrollTop += e.deltaY;
                    }}
                  >
                    <div className="grid grid-cols-12 border-b pb-2 text-sm font-medium text-gray-500">
                      <div className="col-span-6">Name</div>
                      <div className="col-span-2">Size</div>
                      <div className="col-span-3">Modified</div>
                    </div>
                    <div>
                      {files.length > 0 ? (
                        files.map((file) => (
                          <div
                            key={file.name}
                            onClick={() => toggleFileSelection({ name: file.name, path: file.path, url: file.url })}
                            className={`grid grid-cols-12 items-center border-b p-2 text-gray-700 cursor-pointer hover:bg-gray-100 ${selectedFiles.some(f => f.path === file.path) ? "bg-blue-100" : ""
                              }`}
                            title={file.name}
                          >

                            <div className="col-span-6 flex items-center truncate">
                              <div className="relative h-10 w-16 border-2 rounded-md overflow-hidden">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="h-full w-full object-fill rounded"
                                    />
                                    {selectedFiles.some(f => f.path === file.path) && (
                                      <div className="absolute top-1 left-1 bg-white rounded-full p-[2px]">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div>
                                    {getFileIcon(file.type)}
                                    {selectedFiles.some(f => f.path === file.path) && (
                                      <div className="absolute top-1 left-1 bg-white rounded-full p-[2px]">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <span className="truncate text-sm px-5">{file.name}</span>
                            </div>
                            <div className="col-span-2 text-sm">{(file.size / 1024).toFixed(2)} KB</div>
                            <div className="col-span-3 text-sm">{formatDate(file.last_modified)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400">No files found.</div>
                      )}
                    </div>
                  </div>
                )}

                {viewMode === "grid" && (
                  <div
                    className="grid grid-cols-3 gap-4 overflow-auto max-h-[420px] p-4"
                    onWheel={(e) => {
                      e.currentTarget.scrollTop += e.deltaY;
                    }}
                  >
                    {files.length > 0 ? (
                      files.map((file) => (
                        <div
                          key={file.name}
                          onClick={() => toggleFileSelection({ name: file.name, path: file.path, url: file.url })}
                          className={`relative group border rounded overflow-hidden cursor-pointer ${selectedFiles.some(f => f.path === file.path) ? "ring-2 ring-blue-500" : ""
                            }`}
                          title={file.name}
                        >
                          {selectedFiles.some(f => f.path === file.path) && (
                            <div className="absolute top-1 right-1 z-10 bg-white rounded-full p-0.5">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          <div className="flex items-center justify-center h-24 bg-gray-100">
                            {file.type.startsWith("image/") ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              getFileIcon(file.type)
                            )}
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black opacity-60 text-white text-xs p-2 transform translate-y-full group-hover:translate-y-0 transition duration-300 ease-in-out">
                            <div className="font-medium truncate text-xs">{file.name}</div>
                            <div className="flex justify-between">
                              <div className="text-xs">{(file.size / 1024).toFixed(2)} KB</div>
                              <div className="text-xs">{formatDate(file.last_modified)}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 p-4 text-center text-gray-400">No files found.</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {/* show file list there */}
          {/* viewMode === 'list' && (
              <div className="grid grid-cols-12 border-b pb-2 text-sm font-medium text-gray-500">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-1"></div>
              </div>
            ) */}

        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-end gap-x-2.5">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onSelectCallBack}
            disabled={selectedFiles.length === 0}
            className="cursor-pointer"
          >
            Select {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </Button>
        </div>
      </div>
      </Portal>
    </Dialog>
  );
}
