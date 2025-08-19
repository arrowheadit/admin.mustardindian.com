import { authAxios } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreatePageItem,UpdatePageItem,PageSectionContent } from '@/types/pages'

export const useCreatePageMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ title,status }:CreatePageItem) => {
            return await authAxios.post('/settings/pages', {
                title: title, 
                status: status,
                
            })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['pages'] })
        }
    })
} 

export const useUpdatePageMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (page: UpdatePageItem) => {
            return await authAxios.put(`/settings/pages/${page.slug}`, {
                id:page.id,
                title: page.title,
                status: page.status,
            })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['pages'] })
        }
    })
}
export const useActiveDeActivePageMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (pageId: string) => {
            return await authAxios.patch(`/settings/pages/${pageId}/status`)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['pages'] })
        }
    })
}
export const useDeletePageMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (pageId: string) => {
            return await authAxios.delete(`/settings/pages/${pageId}`)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['pages'] })
        }
    })
}

export const useUpdatePageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      formContent,
      pageSlug,
    }: {
      formContent: PageSectionContent,
      pageSlug: string
    }) => {
      return await authAxios.put(`/settings/pages/${pageSlug}/content`, {
        content: formContent
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};
