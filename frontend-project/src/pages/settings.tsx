import { useState } from 'react';
import { Navbar } from '../components/navbar';
import {
    User, Palette, KeyboardIcon, ChevronRight,
    Mail, Save, Check, Monitor, Sparkles, Type,
    Gauge, Target, MousePointer, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, getAvatarPath, AVATAR_COUNT } from '../context/SettingsContext';
import type { ThemeOption, FontSize, CaretStyle } from '../context/SettingsContext';

type Tab = 'profile' | 'theme' | 'typing';

interface ToggleProps {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

function SettingsToggle({ enabled, onToggle, label, description, icon }: ToggleProps) {
    return (
        <div className="flex items-center justify-between py-4 group">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center
                        transition-all duration-300
                        ${enabled
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            : 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/40'}
                    `}>
                        {icon}
                    </div>
                )}
                <div>
                    <div className="text-sm font-medium text-zinc-200">{label}</div>
                    {description && (
                        <div className="text-xs text-zinc-500 mt-0.5">{description}</div>
                    )}
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`
                    relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer
                    ${enabled
                        ? 'bg-amber-500 shadow-lg shadow-amber-500/25'
                        : 'bg-zinc-700 hover:bg-zinc-600'}
                `}
            >
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`
                        absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md
                        ${enabled ? 'left-6' : 'left-0.5'}
                    `}
                />
            </button>
        </div>
    );
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'User Profile', icon: <User className="w-4 h-4" /> },
    { key: 'theme', label: 'Theme & Visuals', icon: <Palette className="w-4 h-4" /> },
    { key: 'typing', label: 'Typing Window', icon: <KeyboardIcon className="w-4 h-4" /> },
];

const themeOptions: { key: ThemeOption; label: string; colors: string[] }[] = [
    { key: 'dark-space', label: 'Dark Space', colors: ['#09090b', '#18181b', '#27272a'] },
    { key: 'midnight', label: 'Midnight', colors: ['#0c0a1a', '#1a1533', '#2a244d'] },
    { key: 'amber-glow', label: 'Amber Glow', colors: ['#1a1000', '#2a1a00', '#3d2800'] },
];

const SettingsPage = () => {
    const { settings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [profileSaved, setProfileSaved] = useState(false);

    const handleProfileSave = () => {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    };

    const renderProfile = () => (
        <motion.div
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-1">User Profile</h2>
                <p className="text-sm text-zinc-500">Manage your account details</p>
            </div>

            <div className="flex items-center gap-5 py-4">
                <div className="
                    w-20 h-20 rounded-2xl
                    border-2 border-amber-500/40
                    overflow-hidden
                    shadow-lg shadow-amber-500/10
                    bg-zinc-800/50
                ">
                    <img
                        src={getAvatarPath(settings.avatar)}
                        alt="Your avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <div className="text-lg font-semibold text-zinc-200">
                        {settings.username || 'Anonymous'}
                    </div>
                    <div className="text-sm text-zinc-500 mt-0.5">
                        {settings.email || 'No email set'}
                    </div>
                </div>
            </div>

            <div>
                <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1 mb-3 block">
                    Choose Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => updateSettings({ avatar: num })}
                            className={`
                                relative rounded-xl overflow-hidden aspect-square
                                transition-all duration-200 cursor-pointer
                                ${settings.avatar === num
                                    ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-900 scale-105 shadow-lg shadow-amber-500/20'
                                    : 'ring-1 ring-zinc-700/50 hover:ring-zinc-500/50 hover:scale-105 opacity-70 hover:opacity-100'}
                            `}
                        >
                            <img
                                src={getAvatarPath(num)}
                                alt={`Avatar ${num}`}
                                className="w-full h-full object-cover"
                            />
                            {settings.avatar === num && (
                                <motion.div
                                    layoutId="avatar-check"
                                    className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-md"
                                >
                                    <Check className="w-3 h-3 text-black" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-zinc-800/80" />

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1">
                        Username
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={settings.username}
                            onChange={(e) => updateSettings({ username: e.target.value })}
                            className="
                                w-full
                                bg-zinc-800/50
                                border border-zinc-700/50
                                text-zinc-200
                                text-sm
                                rounded-xl
                                pl-12 pr-4 py-3.5
                                outline-none
                                focus:border-amber-500/50
                                focus:ring-1 focus:ring-amber-500/50
                                placeholder:text-zinc-600
                                transition-all
                                duration-200"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1">
                        Email
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                        </div>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => updateSettings({ email: e.target.value })}
                            className="
                                w-full
                                bg-zinc-800/50
                                border border-zinc-700/50
                                text-zinc-200
                                text-sm
                                rounded-xl
                                pl-12 pr-4 py-3.5
                                outline-none
                                focus:border-amber-500/50
                                focus:ring-1 focus:ring-amber-500/50
                                placeholder:text-zinc-600
                                transition-all
                                duration-200"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleProfileSave}
                className="
                    flex items-center gap-2
                    px-6 py-3 rounded-xl
                    bg-amber-500 text-black font-bold tracking-wide
                    hover:bg-amber-400
                    active:scale-95
                    transition-all
                    shadow-lg shadow-amber-500/20
                    mt-2
                "
            >
                {profileSaved ? (
                    <>
                        <Check className="w-4 h-4" /> Saved!
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" /> Save Changes
                    </>
                )}
            </button>
        </motion.div>
    );

    const renderTheme = () => (
        <motion.div
            key="theme"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-1">Theme & Visuals</h2>
                <p className="text-sm text-zinc-500">Customize the look and feel</p>
            </div>

            <div>
                <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1 mb-3 block">
                    Color Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => updateSettings({ theme: t.key })}
                            className={`
                                relative rounded-xl p-3 border transition-all duration-300 cursor-pointer
                                ${settings.theme === t.key
                                    ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                                    : 'border-zinc-700/40 bg-zinc-800/30 hover:border-zinc-600/60 hover:bg-zinc-800/50'}
                            `}
                        >
                            <div className="flex gap-1 mb-3 justify-center">
                                {t.colors.map((c, i) => (
                                    <div
                                        key={i}
                                        className="w-6 h-6 rounded-full border border-white/10"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                            <div className={`text-xs font-medium text-center ${settings.theme === t.key ? 'text-amber-400' : 'text-zinc-400'}`}>
                                {t.label}
                            </div>
                            {settings.theme === t.key && (
                                <motion.div
                                    layoutId="theme-check"
                                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center"
                                >
                                    <Check className="w-3 h-3 text-black" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-zinc-800/80" />

            <SettingsToggle
                enabled={settings.backgroundAnimation}
                onToggle={() => updateSettings({ backgroundAnimation: !settings.backgroundAnimation })}
                label="Background Animation"
                description="Enable the animated space background"
                icon={<Sparkles className="w-4 h-4" />}
            />

            <div className="w-full h-px bg-zinc-800/80" />

            <div className="py-2">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-zinc-500">
                        <Type className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-zinc-200">Font Size</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Adjust the interface font size</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                        <button
                            key={size}
                            onClick={() => updateSettings({ fontSize: size })}
                            className={`
                                flex-1 py-2.5 rounded-lg text-sm font-medium capitalize
                                transition-all duration-200 cursor-pointer
                                ${settings.fontSize === size
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/40 hover:bg-zinc-800/80 hover:text-zinc-300'}
                            `}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-zinc-800/80" />

            <SettingsToggle
                enabled={settings.highContrast}
                onToggle={() => updateSettings({ highContrast: !settings.highContrast })}
                label="High Contrast Mode"
                description="Increase contrast for better readability"
                icon={<Monitor className="w-4 h-4" />}
            />
        </motion.div>
    );

    const renderTyping = () => (
        <motion.div
            key="typing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-1">Typing Window</h2>
                <p className="text-sm text-zinc-500">Configure your typing experience</p>
            </div>

            <div>
                <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1 mb-1 block">
                    Live Statistics
                </label>
                <SettingsToggle
                    enabled={settings.liveWpm}
                    onToggle={() => updateSettings({ liveWpm: !settings.liveWpm })}
                    label="Live WPM"
                    description="Show words-per-minute while typing"
                    icon={<Gauge className="w-4 h-4" />}
                />
                <div className="w-full h-px bg-zinc-800/60" />
                <SettingsToggle
                    enabled={settings.liveAccuracy}
                    onToggle={() => updateSettings({ liveAccuracy: !settings.liveAccuracy })}
                    label="Live Accuracy"
                    description="Show accuracy percentage while typing"
                    icon={<Target className="w-4 h-4" />}
                />
            </div>

            <div className="w-full h-px bg-zinc-800/80" />

            <div>
                <label className="text-xs uppercase tracking-widest text-zinc-400 ml-1 mb-1 block">
                    Caret
                </label>
                <SettingsToggle
                    enabled={settings.smoothCaret}
                    onToggle={() => updateSettings({ smoothCaret: !settings.smoothCaret })}
                    label="Smooth Caret"
                    description="Animate caret movement between letters"
                    icon={<MousePointer className="w-4 h-4" />}
                />

                <div className="w-full h-px bg-zinc-800/60" />

                <div className="py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center text-zinc-500">
                            <Type className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-zinc-200">Caret Style</div>
                            <div className="text-xs text-zinc-500 mt-0.5">Choose your preferred caret appearance</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {([
                            { key: 'line' as CaretStyle, preview: '│', label: 'Line' },
                            { key: 'block' as CaretStyle, preview: '█', label: 'Block' },
                            { key: 'underline' as CaretStyle, preview: '_', label: 'Underline' },
                        ]).map((style) => (
                            <button
                                key={style.key}
                                onClick={() => updateSettings({ caretStyle: style.key })}
                                className={`
                                    flex-1 py-4 rounded-xl text-center
                                    transition-all duration-200 cursor-pointer
                                    ${settings.caretStyle === style.key
                                        ? 'bg-amber-500/15 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                                        : 'bg-zinc-800/30 border border-zinc-700/40 hover:bg-zinc-800/60 hover:border-zinc-600/50'}
                                `}
                            >
                                <div className={`text-2xl font-mono mb-1 ${settings.caretStyle === style.key ? 'text-amber-400' : 'text-zinc-500'}`}>
                                    {style.preview}
                                </div>
                                <div className={`text-xs font-medium ${settings.caretStyle === style.key ? 'text-amber-400' : 'text-zinc-500'}`}>
                                    {style.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-zinc-800/80" />

            <SettingsToggle
                enabled={settings.soundOnKey}
                onToggle={() => updateSettings({ soundOnKey: !settings.soundOnKey })}
                label="Sound on Keypress"
                description="Play a subtle click sound when typing"
                icon={<Volume2 className="w-4 h-4" />}
            />
        </motion.div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-gray-200">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4 font-mono">
                <div className="
                    w-full
                    max-w-4xl
                    rounded-3xl
                    bg-zinc-900/70
                    backdrop-blur-xl
                    border border-zinc-700/40
                    shadow-2xl
                    p-8 sm:p-10
                    relative
                    overflow-hidden
                ">
  
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                       
                        <div className="md:w-56 shrink-0">
                            <h1 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                                    <KeyboardIcon className="w-4 h-4 text-amber-400" />
                                </div>
                                Settings
                            </h1>
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`
                                            w-full flex items-center justify-between
                                            px-4 py-3 rounded-xl text-sm font-medium
                                            transition-all duration-200 cursor-pointer
                                            ${activeTab === tab.key
                                                ? 'bg-zinc-800/70 text-amber-400 border border-zinc-700/50'
                                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'}
                                        `}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            {tab.icon}
                                            {tab.label}
                                        </span>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${activeTab === tab.key ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="hidden md:block w-px bg-zinc-800/80 self-stretch" />

                        <div className="flex-1 min-h-[420px]">
                            <AnimatePresence mode="wait">
                                {activeTab === 'profile' && renderProfile()}
                                {activeTab === 'theme' && renderTheme()}
                                {activeTab === 'typing' && renderTyping()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
