import { authAxios } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

export const useControlListElementsQuery = () => {
    return useQuery({
        queryKey: ["controlListElement"],
        queryFn: async () => {
            const res = await authAxios.get(
              "/settings/get-control-list-elements"
            );
            return res.data;
        },
    })
}