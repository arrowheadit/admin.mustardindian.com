import { authAxios } from "@/lib/axios"
import type { FileItem, Folder } from "@/types/file-manager"
import { useQuery } from "@tanstack/react-query"

export const useFoldersQuery = () => {
    return useQuery<Array<Folder>>({
        queryKey: ['folders_qry'],
        queryFn: async () => {
            const res = await authAxios.get('/file-manager/folders')
            return res.data
        }
    })
}

export const useFilesQuery = ({ 
    folder_path 
}:{ 
    folder_path: string | null
}) => {
    return useQuery<Array<FileItem>>({
        queryKey: ['files_qry', folder_path],
        queryFn: async () => {
            const res = await authAxios.get('/file-manager/files', {
                params: { folder_path },
            })
            return res.data
        },
        enabled: !!folder_path
    })
}