import { authAxios } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PageSection, PageSectionContent } from "@/types/pages";


export const useCreatePageSectionMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id,page_id, title, sub_title, img_src, img_alt, img_width, img_height, img_instruction }: PageSection) => {
        return await authAxios.patch("/settings/page-section", {
            id,
            page_id,
            title,
            sub_title,
            img_src,
            img_alt,
            img_width,
            img_height,
            img_instruction
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["page-section"] });
      },
    });
} 
export const useUpdatePageSectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: PageSection) => {
      return await authAxios.patch(`/settings/page-section/${section.id}`, {
        id: section.id,
        title: section.title,
        sub_title: section.sub_title,
        img_src: section.img_src,
        img_alt: section.img_alt,
        img_width: section.img_width,
        img_height: section.img_height,
        img_instruction: section.img_instruction,
        page_id: section.page_id,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["page-section"] });
    },
  });
};

export const useUpdatePageSectionContentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (page: PageSectionContent) => {
        return await authAxios.patch(`/settings/page-content/${page.id}`, {
          id: page.id,
          title: page.title,
          sub_title: page.sub_title,
          img_src: page.img_src,
          img_alt: page.img_alt,
          img_width: page.img_width,
          img_height: page.img_height,
          img_instruction: page.img_instruction,
          content: page.content,
          page_id: page.page_id,
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["page-section"] });
      },
    });
}


export const useDeletePageSectionItemMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (itemId: number) => {
            return await authAxios.delete(`/settings/page-section/${itemId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["page-section"] });
        }
    })
}

export const useCreateListContentMutation = () => {
  const queryClient = useQueryClient()
  console.log("Creating list content...");
  return useMutation({
    mutationFn: async ({
      id,
      page_id,
      section_id,
      type,
      title,
      sub_title,
      link,
      img_src,
      img_alt,     
    }: PageSectionContent) => {
      return await authAxios.post("/settings/page-content", {
        id,
        page_id,
        section_id,
        type,
        title,
        sub_title,
        link,
        img_src,
        img_alt,
        
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["page-section"] });
    },
  });
}
  
  export const useUpdateListContentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (page: PageSectionContent) => {
        return await authAxios.patch(`/settings/page-content/${page.id}`, {
          id: page.id,
          title: page.title,
          sub_title: page.sub_title,
          link: page.link,
          img_src: page.img_src,
          img_alt: page.img_alt,          
          content: page.content,
          page_id: page.page_id,
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["page-section"] });
      },
    });
  }
  export const useDeleteListContentMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (itemId: number) => {
            return await authAxios.delete(`/settings/page-content/${itemId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["page-section"] });
        }
    })
}
