import { authAxios } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export const useConfigArrayQuery = () => {
    return useQuery({
        queryKey: ["configArray"],
        queryFn: async () => {
            const res = await authAxios.get("/config-array");
            return res.data;
        },
    })
}