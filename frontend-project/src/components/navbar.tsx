import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Keyboard, Trophy, Settings, LogIn, LogOut, Zap, Clock, Type, Gamepad2, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAvatarPath } from "../context/SettingsContext";

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    return (
        <nav className="
            sticky top-0 z-50
            w-full
            bg-zinc-900/40
            backdrop-blur-2xl
            border-b border-zinc-700/30
        ">
            <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2.5 group"
                >
                    <div className="
                        w-8 h-8 rounded-lg
                        bg-amber-500/15
                        border border-amber-500/25
                        flex items-center justify-center
                        group-hover:bg-amber-500/25
                        transition-all duration-300
                    ">
                        <Keyboard className="w-4 h-4 text-amber-400" />
                    </div>
                    <h1 className="text-lg font-bold tracking-wide text-zinc-100">
                        Type<span className="text-amber-500">Rush</span>
                    </h1>
                </button>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate("/home")}
                        className={`
                            px-3.5 py-2 rounded-lg text-sm font-medium
                            transition-all duration-200
                            ${isActive("/home")
                                ? "bg-zinc-800/70 text-amber-400"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                            }
                        `}
                    >
                        Practice
                    </button>
                    <button
                        onClick={() => navigate("/leaderboard")}
                        className={`
                            px-3.5 py-2 rounded-lg text-sm font-medium
                            flex items-center gap-1.5
                            transition-all duration-200
                            ${isActive("/leaderboard")
                                ? "bg-zinc-800/70 text-amber-400"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                            }
                        `}
                    >
                        <Trophy className="w-3.5 h-3.5" />
                        Leaderboard
                    </button>
                    <button
                        onClick={() => navigate("/settings")}
                        className={`
                            px-3.5 py-2 rounded-lg text-sm font-medium
                            flex items-center gap-1.5
                            transition-all duration-200
                            ${isActive("/settings")
                                ? "bg-zinc-800/70 text-amber-400"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                            }
                        `}
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                    </button>

                    <div className="w-px h-5 bg-zinc-700/50 mx-2" />

                    {user ? (
                        /* ---- Profile Avatar ---- */
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="
                                    w-9 h-9 rounded-full
                                    border-2 border-amber-500/40
                                    hover:border-amber-400
                                    overflow-hidden
                                    transition-all duration-200
                                    hover:scale-105
                                    active:scale-95
                                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                                "
                            >
                                <img
                                    src={getAvatarPath(user.avaPic || 1)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {/* Stats Dropdown */}
                            {showDropdown && (
                                <div className="
                                    absolute right-0 top-12
                                    w-72
                                    bg-zinc-900/95 backdrop-blur-xl
                                    border border-zinc-700/50
                                    rounded-2xl
                                    shadow-2xl shadow-black/40
                                    overflow-hidden
                                    animate-in fade-in slide-in-from-top-2
                                    z-[100]
                                ">
                                    {/* Header */}
                                    <div className="px-5 pt-5 pb-4 border-b border-zinc-700/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={getAvatarPath(user.avaPic || 1)}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-zinc-100 font-semibold text-sm truncate">{user.name}</p>
                                                <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        {/* Level badge */}
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="
                                                px-2.5 py-1 rounded-lg
                                                bg-amber-500/10 border border-amber-500/20
                                                text-amber-400 text-xs font-bold
                                                flex items-center gap-1
                                            ">
                                                <Star className="w-3 h-3" />
                                                Level {user.level}
                                            </div>
                                            <div className="text-zinc-500 text-xs">
                                                {user.exp} XP
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="px-5 py-4 grid grid-cols-2 gap-3">
                                        <div className="
                                            px-3 py-2.5 rounded-xl
                                            bg-zinc-800/50 border border-zinc-700/30
                                        ">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Zap className="w-3 h-3 text-amber-400" />
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wider">XP</span>
                                            </div>
                                            <p className="text-zinc-100 font-bold text-sm">{user.exp.toLocaleString()}</p>
                                        </div>
                                        <div className="
                                            px-3 py-2.5 rounded-xl
                                            bg-zinc-800/50 border border-zinc-700/30
                                        ">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Type className="w-3 h-3 text-emerald-400" />
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Chars</span>
                                            </div>
                                            <p className="text-zinc-100 font-bold text-sm">{user.totalCharsTyped.toLocaleString()}</p>
                                        </div>
                                        <div className="
                                            px-3 py-2.5 rounded-xl
                                            bg-zinc-800/50 border border-zinc-700/30
                                        ">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Clock className="w-3 h-3 text-sky-400" />
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Time</span>
                                            </div>
                                            <p className="text-zinc-100 font-bold text-sm">{formatTime(user.totalTimeTyped)}</p>
                                        </div>
                                        <div className="
                                            px-3 py-2.5 rounded-xl
                                            bg-zinc-800/50 border border-zinc-700/30
                                        ">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Gamepad2 className="w-3 h-3 text-violet-400" />
                                                <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Games</span>
                                            </div>
                                            <p className="text-zinc-100 font-bold text-sm">{user.gamesPlayed.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Logout */}
                                    <div className="px-5 pb-4">
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                logout();
                                            }}
                                            className="
                                                w-full px-3 py-2.5 rounded-xl
                                                text-sm font-medium
                                                text-red-400
                                                bg-red-500/5 border border-red-500/15
                                                hover:bg-red-500/10 hover:border-red-500/30
                                                flex items-center justify-center gap-2
                                                transition-all duration-200
                                                active:scale-95
                                            "
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ---- Login Button ---- */
                        <button
                            onClick={() => navigate("/login")}
                            className="
                                px-4 py-2 rounded-lg text-sm font-semibold
                                bg-amber-500/10
                                text-amber-400
                                border border-amber-500/20
                                hover:bg-amber-500/20
                                hover:border-amber-500/35
                                active:scale-95
                                transition-all duration-200
                            "
                        >
                            <span className="flex items-center gap-1.5">
                                <LogIn className="w-3.5 h-3.5" />
                                Login
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
