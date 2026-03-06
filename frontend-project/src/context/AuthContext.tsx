import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/api';
import { getAccessToken, setAccessToken } from '../auth/tokenService';

export interface UserData {
    _id: string;
    name: string;
    email: string;
    avaPic: number;
    exp: number;
    level: number;
    totalCharsTyped: number;
    totalTimeTyped: number;
    gamesPlayed: number;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (userData: UserData) => void;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const userId = localStorage.getItem('userId');
            const token = getAccessToken();

            if (userId && token) {
                try {
                    const res = await api.get(`/user/${userId}/profile`);
                    setUser(res.data);
                } catch {
                    setUser(null);
                }
            }
            setLoading(false);
        };
        restoreSession();
    }, []);

    const login = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('userId', userData._id);
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('userId');
        window.location.href = '/home';
    };

    const refreshProfile = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/user/${user._id}/profile`);
            setUser(res.data);
        } catch {
            // silent fail
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
