import type { LoginFormValues } from "@/schema";

interface AuthUser {
    name: string;
    email: string;
    player_id: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (userData: LoginFormValues) => void;
    logout: () => void;
    token: string | null;
    isLoading: boolean;
}

