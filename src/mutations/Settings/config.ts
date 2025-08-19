import { authAxios } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ConfigItem } from '@/types/configs'

export const useCreateConfigMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ property,value,status }:ConfigItem) => {
            return await authAxios.post('/settings/pages', {
                property: property, 
                value: value,
                status: status,
                
            })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['pages'] })
        }
    })
} 

export const useUpdateConfigMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (config: ConfigItem) => {
            return await authAxios.put(`/settings/configs/${config.id}`, {
                property: config.property,
                value: config.value,
                status: config.status,
            })
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['configs'] })
        }
    })
}
export const useActiveDeActiveConfigMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (configId: number) => {
            return await authAxios.patch(`/settings/configs/${configId}/status`)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['configs'] })
        }
    })
}
export const useDeleteConfigMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (configId: string) => {
            return await authAxios.delete(`/settings/configs/${configId}`)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['configs'] })
        }
    })
}


