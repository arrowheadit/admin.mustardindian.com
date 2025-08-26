import { authAxios } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GalleryItem } from '@/types/galleries';


export const useCreateGalleryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ name,link, title, sub_title, img_src, img_alt, content,status }: GalleryItem) => {
        return await authAxios.post("/galleries", {
          name,
          link,
          title,
          sub_title,
          img_src,
          img_alt,         
          content,
          status
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["galleries"] });
      },
    });
} 

  
  export const useUpdateGalleryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (gallery: GalleryItem) => {
        return await authAxios.patch(`/galleries/${gallery.id}`, {
          id: gallery.id,
          name:gallery.name,
          title: gallery.title,
          sub_title: gallery.sub_title,
          link: gallery.link,
          img_src: gallery.img_src,
          img_alt: gallery.img_alt,          
          content: gallery.content,
          status:gallery.status
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["galleries"] });
      },
    });
  }
  export const useDeleteGalleryMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (itemId: number) => {
            return await authAxios.delete(`/galleries/${itemId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["galleries"] });
        }
    })
}
