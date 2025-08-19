import PopConfirmDialog from "@/components/dialogs/pop-confirm-dialog";
import { useFileManager } from "@/context/hooks";
import type { Folder } from "@/types/file-manager";
import { AnimatePresence, motion } from "framer-motion";
import { Folder as FolderIcon, FolderOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import CreateFolderInput from "./ui/create-folder-input";

interface FolderTreeProps {
    folders?: Folder[];
    depth?: number;
}

export default function FolderTree({ folders: propFolders, depth = 0 }: FolderTreeProps) {
    const {
        folders: contextFolders,
        activeFolderPath,
        setActiveFolderPath,
        deleteFolder,
        deletingFolder,
    } = useFileManager();

    const folders = propFolders ?? contextFolders;
    const [openFolderPath, setOpenFolderPath] = useState<string | null>(null);
    const [openConfirmForPath, setOpenConfirmForPath] = useState<string | null>(null);
    const [showChildFolderInput, setShowChildFolderInput] = useState<{
        open: boolean,
        path?: string
    }>({
        open: false,
        path: undefined
    })

    if (!folders || folders.length === 0) return null;

    const handleFolderClick = (folderPath: string) => {
        setOpenFolderPath(openFolderPath === folderPath ? null : folderPath);
        setActiveFolderPath(folderPath);
    };

    const handleDeleteFolder = async (folderPath: string) => {
        await deleteFolder({ folder_path: folderPath });
        setOpenConfirmForPath(null); // close dialog after deletion
    };

    return (
        folders.map((folder) => (
            <div key={folder.path} style={{ marginLeft: depth * 16, padding: "4px 0" }}>
                <div
                    className={`flex justify-between items-center rounded-md ${activeFolderPath === folder.path ? 'bg-gray-100' : ''} hover:bg-gray-100 px-2.5 py-2 cursor-pointer`}
                    onClick={() => handleFolderClick(folder.path)}
                >
                    <div className="flex justify-start items-center gap-x-0.5">
                        {activeFolderPath === folder.path ? (
                            <FolderOpen className="h-5 w-5 text-blue-500" />
                        ) : (
                            <FolderIcon className="h-5 w-5 text-gray-500" />
                        )}
                        <span className={`text-sm font-medium truncate ${activeFolderPath === folder.path ? 'text-blue-700' : ''}`}>
                            {folder.name}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowChildFolderInput({
                                    open: true,
                                    path: folder.path
                                })
                            }}
                            title="Add subfolder"
                        >
                            <Plus className="h-3 w-3 text-gray-500" />
                        </button>
                        <PopConfirmDialog
                            title="Delete this folder?"
                            description={`This will permanently delete "${folder.name}" and its contents.`}
                            triggerButton={
                                <button
                                    type="button"
                                    className="cursor-pointer p-1 hover:bg-gray-100 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenConfirmForPath(folder.path);
                                    }}
                                    disabled={deletingFolder}
                                    title="Delete folder"
                                >
                                    {deletingFolder? (
                                        <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-3 w-3 text-gray-500" />
                                    )}
                                </button>
                            }
                            isLoading={deletingFolder}
                            open={openConfirmForPath === folder.path}
                            onOpenChange={(open) => {
                                if (open) {
                                    setOpenConfirmForPath(folder.path);
                                } else {
                                    setOpenConfirmForPath(null);
                                }
                            }}
                            confirmAction={() => handleDeleteFolder(folder.path)}
                            cancelAction={() => setOpenConfirmForPath(null)}
                        />
                    </div>
                </div>
                {showChildFolderInput.open && showChildFolderInput.path === folder.path && 
                    <div className="flex items-center ml-6 mt-1 mb-1">
                        <CreateFolderInput 
                            showInputFieldController={[true, (S:boolean) => setShowChildFolderInput({ open: S, path: undefined })]} 
                            parantPath={folder.path}
                        />
                    </div>
                }
                <AnimatePresence>
                    {openFolderPath === folder.path && folder.children.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                        >
                            <FolderTree folders={folder.children} depth={depth + 1} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ))
    );
}
