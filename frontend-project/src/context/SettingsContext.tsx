import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeOption = 'dark-space' | 'midnight' | 'amber-glow';
export type FontSize = 'small' | 'medium' | 'large';
export type CaretStyle = 'line' | 'block' | 'underline';

export interface AppSettings {
    // Profile
    username: string;
    email: string;
    avatar: number;
    // Theme & Visuals
    theme: ThemeOption;
    backgroundAnimation: boolean;
    fontSize: FontSize;
    highContrast: boolean;
    // Typing Window
    liveWpm: boolean;
    liveAccuracy: boolean;
    smoothCaret: boolean;
    soundOnKey: boolean;
    caretStyle: CaretStyle;
}

// Avatar paths helper
export const AVATAR_COUNT = 11;
export const getAvatarPath = (num: number) => `/avator%20pic/ava${num}.png`;

const defaultSettings: AppSettings = {
    username: '',
    email: '',
    avatar: 1,
    theme: 'dark-space',
    backgroundAnimation: true,
    fontSize: 'medium',
    highContrast: false,
    liveWpm: true,
    liveAccuracy: true,
    smoothCaret: true,
    soundOnKey: false,
    caretStyle: 'line',
};

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (partial: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
    return ctx;
}

function loadSettings(): AppSettings {
    try {
        const saved = localStorage.getItem('typerush-settings');
        if (saved) {
            return { ...defaultSettings, ...JSON.parse(saved) };
        }
    } catch { /* ignore */ }
    return defaultSettings;
}

// Theme color configurations for the canvas background
export const THEME_CONFIGS = {
    'dark-space': {
        gradient: [
            { stop: 0, color: '#0d1117' },
            { stop: 0.4, color: '#090c10' },
            { stop: 1, color: '#030508' },
        ],
        nebula1: 'rgba(30, 40, 80, 0.06)',
        nebula2: 'rgba(50, 30, 60, 0.04)',
        constellationColor: 'rgba(180, 200, 230, 0.15)',
    },
    'midnight': {
        gradient: [
            { stop: 0, color: '#0f0d1f' },
            { stop: 0.4, color: '#0a0818' },
            { stop: 1, color: '#050410' },
        ],
        nebula1: 'rgba(60, 40, 120, 0.08)',
        nebula2: 'rgba(80, 50, 140, 0.05)',
        constellationColor: 'rgba(160, 170, 255, 0.18)',
    },
    'amber-glow': {
        gradient: [
            { stop: 0, color: '#1a1208' },
            { stop: 0.4, color: '#120d05' },
            { stop: 1, color: '#080502' },
        ],
        nebula1: 'rgba(100, 70, 20, 0.08)',
        nebula2: 'rgba(80, 50, 10, 0.06)',
        constellationColor: 'rgba(255, 200, 120, 0.15)',
    },
} as const;

// Font size CSS values
export const FONT_SIZE_MAP: Record<FontSize, string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(loadSettings);

    const updateSettings = (partial: Partial<AppSettings>) => {
        setSettings(prev => ({ ...prev, ...partial }));
    };

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem('typerush-settings', JSON.stringify(settings));
    }, [settings]);

    // Apply font size to the document root
    useEffect(() => {
        document.documentElement.style.fontSize = FONT_SIZE_MAP[settings.fontSize];
    }, [settings.fontSize]);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
