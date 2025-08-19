import { authAxios } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

type UsePageQueryParams = {
    page?: number,
    page_size?: number;
    sort_by?: string;
    sort_type?: string;
    search?: string;
    slug?: string;
}
export const usePageSectionQuery = (params: UsePageQueryParams) => {
    return useQuery({
        queryKey: ["page-section", params],
        queryFn: async () => {
            const res = await authAxios.get("/settings/page-section", { params });
            return res.data
        },
    })
}