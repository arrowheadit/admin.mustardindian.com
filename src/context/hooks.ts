import { use } from "react"
import { AuthContext, FileManagerContext } from "."

export const useAuth = () => {
    const context = use(AuthContext)
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

export const useFileManager = () => {
    const context = use(FileManagerContext)
    if (context === undefined) throw new Error('useFileManager must be used within an FileManagerProvider')
    return context
}