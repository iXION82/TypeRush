import { useNavigate } from "react-router-dom";
export function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="
            sticky top-0 z-50
            w-full
            bg-zinc-900/60
            backdrop-blur-xl
            border-b border-zinc-700/40
        ">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold tracking-wide text-zinc-100">
                    Type<span className="text-amber-500">Rush</span>
                </h1>
                <div className="flex gap-6 text-sm text-zinc-300">
                    <button 
                        onClick={()=>{navigate("/leaderboard");}}
                        className="hover:text-amber-400 transition">
                        Leaderboard
                    </button>
                    <button className="hover:text-amber-400 transition">
                        Settings
                    </button>
                    <button
                        onClick={()=>{navigate("/login");}}
                        className="
                            px-4 py-2 rounded-full
                            bg-amber-500/10
                            text-amber-400
                            hover:bg-amber-500/20
                            transition">
                        Login
                    </button>
                </div>

            </div>
        </nav>
    );
}
