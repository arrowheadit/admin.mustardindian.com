import { useFilesQuery, useFoldersQuery } from "@/queris";
import { FileManagerContext } from "..";
import { useState } from "react";
import { useCreateFolderMutation, useDeleteFolderMutation, useEditFolderMutation } from "@/mutations";
import type { ViewMode } from "@/types/file-manager";

export function FileManagerProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
    const [ activeFolderPath, setActiveFolderPath ] = useState<string | null>(null)
    const [ viewMode, setViewMode ] = useState<ViewMode>('grid');
    const [openUploader, setOpenUploader] = useState<boolean>(false)

    // folder qry
    const { data: folders } = useFoldersQuery()
    const { data: files } = useFilesQuery({ folder_path: activeFolderPath })
    
    // folder mutations
    const { mutateAsync: createFolderMutateAsync, isPending: creatingFolder } = useCreateFolderMutation()
    const { mutateAsync: deleteFolderMutateAsync, isPending: deletingFolder } = useDeleteFolderMutation()
    const { mutateAsync: editingFolderMutateAsync, isPending: editingFolder } = useEditFolderMutation()

    const createFolder = async (
        { folder_path }: { folder_path: string },
        callbacks?: { onSuccessCallback?: () => void; onErrorCallback?: () => void }
    ) => await createFolderMutateAsync({ folder_path }, {
        onSuccess: () => callbacks?.onSuccessCallback?.(),
        onError: () => callbacks?.onErrorCallback?.()
    })

    const deleteFolder = async (
        { folder_path }: { folder_path: string },
        callbacks?: { onSuccessCallback?: () => void; onErrorCallback?: () => void }
    ) => await deleteFolderMutateAsync({ folder_path }, {
        onSuccess: () => callbacks?.onSuccessCallback?.(),
        onError: () => callbacks?.onErrorCallback?.()
    })

    const editFolder = async (
        { new_folder_path, old_folder_path }: { old_folder_path: string, new_folder_path: string },
        callbacks?: { onSuccessCallback?: () => void; onErrorCallback?: () => void }
    ) => await editingFolderMutateAsync({ new_folder_path, old_folder_path }, {
        onSuccess: () => callbacks?.onSuccessCallback?.(),
        onError: () => callbacks?.onErrorCallback?.()
    })

    return (
        <FileManagerContext value={{
            viewMode, 
            setViewMode,
            openUploader, 
            setOpenUploader,
            folders: folders ?? [],
            files: files ?? [],
            activeFolderPath,
            setActiveFolderPath,
            createFolder,
            creatingFolder,
            deletingFolder,
            editingFolder,
            deleteFolder,
            editFolder
        }}>
            {children}
        </FileManagerContext>
    )
}

