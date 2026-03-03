import { useNavigate, useLocation } from "react-router-dom";
import { Keyboard, Trophy, Settings, LogIn } from "lucide-react";

export function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

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
                        className="
                            px-3.5 py-2 rounded-lg text-sm font-medium
                            text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40
                            flex items-center gap-1.5
                            transition-all duration-200
                        "
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                    </button>

                    <div className="w-px h-5 bg-zinc-700/50 mx-2" />

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
                </div>
            </div>
        </nav>
    );
}
