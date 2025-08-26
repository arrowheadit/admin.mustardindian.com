import { authAxios } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { OfferItem } from '@/types/offers';
import { format } from "date-fns";


export const useCreateOfferMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (offer: OfferItem) => {
        
        return await authAxios.post("/offers", {
          ...offer,
          start_date: offer.start_date
            ? format(offer.start_date, "yyyy-MM-dd")
            : undefined,
          end_date: offer.end_date
            ? format(offer.end_date, "yyyy-MM-dd")
            : undefined,
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["offers"] });
      },
    });
} 

  
  export const useUpdateOfferMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (offer: OfferItem) => {
        return await authAxios.patch(`/offers/${offer.id}`, {
          id: offer.id,
          name:offer.name,
          start_date: offer.start_date,
          end_date:offer.end_date,
          title: offer.title,
          sub_title: offer.sub_title,
          link: offer.link,
          img_src: offer.img_src,
          img_alt: offer.img_alt,         
          content: offer.content,
          status:offer.status
        });
      },
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["offers"] });
      },
    });
  }
  export const useDeleteOfferMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (itemId: number) => {
            return await authAxios.delete(`/offers/${itemId}`);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["offers"] });
        }
    })
}
