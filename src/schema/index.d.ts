export interface LoginFormValues {
    credential: string
    password: string
    rememberMe: boolean
}

export interface CreatePostFormValues {
    title: string
    description: string
    category_id: number
    tags: Array<number>
    banner: string
    banner_image_alt: string
    list_image: string
    list_image_alt: string
    is_published: boolean
    is_featured: boolean
}