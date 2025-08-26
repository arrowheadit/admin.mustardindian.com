import { authAxios } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

type UsePageQueryParams = {
    page?: number,
    page_size?: number;
    sort_by?: string;
    sort_type?: string;
    search?: string;
}
export const useOfferQuery = (params: UsePageQueryParams) => {
    return useQuery({
        queryKey: ["offers", params],
        queryFn: async () => {
            const res = await authAxios.get("/offers", { params });
            return res.data;
        },
    })
}