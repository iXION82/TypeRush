import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/api';
import { setAccessToken } from '../auth/tokenService';

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
    bestScores?: Record<string, { wpm: number, accuracy: number, date: string }>;
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
            if (!userId) {
                setLoading(false);
                return;
            }

            try {

                const refreshRes = await api.post('/auth/refresh');
                const newToken = refreshRes.data.accessToken;
                setAccessToken(newToken);

                const profileRes = await api.get(`/user/${userId}/profile`);
                setUser(profileRes.data);
            } catch {
                setUser(null);
                localStorage.removeItem('userId');
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
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
