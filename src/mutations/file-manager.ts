import { authAxios } from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateFolderMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            folder_path
        }: {
            folder_path: string
        }) => {
            const res = await authAxios.post('/file-manager/create-folder', { folder_path })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders_qry"] });
        }
    })
}

export const useDeleteFolderMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            folder_path
        }: {
            folder_path: string
        }) => {
            const res = await authAxios.delete('/file-manager/delete-folder', {
                data: { folder_path }  // DELETE with body requires `data` key in axios
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders_qry"] });
        },
    });
};


export const useEditFolderMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            old_folder_path,
            new_folder_path,
        }: {
            old_folder_path: string;
            new_folder_path: string;
        }) => {
            const res = await authAxios.put('/file-manager/edit-folder', {
                old_folder_path,
                new_folder_path,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders_qry"] });
        },
    });
};

export const useUploadFilesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folder_path,
      file,
    }: {
      folder_path: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append('folder_path', folder_path);
      formData.append('file', file);

      const res = await authAxios.post('/file-manager/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders_qry'] });
      queryClient.invalidateQueries({ queryKey: ['files_qry'] });
    },
  })
};