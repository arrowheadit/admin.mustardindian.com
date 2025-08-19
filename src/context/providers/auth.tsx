import {useEffect, useState } from 'react';
import { AuthContext } from '..';
import { authAxios, guestAxios } from '@/lib/axios';
import type { LoginFormValues } from '@/schema';
import Cookies from 'js-cookie';
import type { AuthUser } from '@/types/auth';

export const AuthProvider = ({ children }: Readonly<{children: React.ReactNode;}>) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ token, setToken ] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    console.log("token", token);
    
    useEffect(() => {
        const auth = Cookies.get('auth');
        if (auth) {
            const { token, user } = JSON.parse(auth);
            setToken(token);
            setUser(user);
        }else {
            setToken(null);
            setUser(null);
        }
    },[]);

    const login = (value: LoginFormValues) => {
        setIsLoading(true);
        guestAxios.post('/auth/sign-in', { 
            credential: value.credential,
            password: value.password
        }).catch((error) => {
            setIsLoading(false);
            console.error("Login error:", error);
        }).then((response) => {
            if (response?.data.data) {
                const { token, user } = response.data.data;
                console.log("Login token", token);
                console.log("Login user", user);
                
                Cookies.set('auth', JSON.stringify({
                    token: response.data.data.token,
                    user: response.data.data.user
                }), {
                    expires: 7,
                });
                setUser(response.data.user);
                setToken(response.data.token);
                window.location.pathname = '/';
            }
            setIsLoading(false);
        });
    };

    const logout = () => {
        authAxios.post('/auth/logout').catch((error) => {
            console.error("Logout error:", error);
        }).then(() => {
            Cookies.remove('auth');
            setUser(null);
            setToken(null);
            window.location.pathname = '/login';
        });
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        token,
        isLoading,
    };

    return <AuthContext value={value}>{children}</AuthContext>;
};

