import { authAxios } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

type UsePageQueryParams = {
    page?: number,
    page_size?: number;
    sort_by?: string;
    sort_type?: string;
    search?: string;
}
export const useConfigQuery = (params: UsePageQueryParams) => {
    return useQuery({
        queryKey: ["configs", params],
        queryFn: async () => {
            const res = await authAxios.get("/settings/configs", { params });
            return res.data;
        },
    })
}