import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ACHIEVEMENTS } from '../constants/achievements';
import { Navbar } from '../components/navbar';

export default function AchievementsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const unlockedCount = ACHIEVEMENTS.filter(a => a.isUnlocked(user)).length;
    const totalCount = ACHIEVEMENTS.length;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-12 flex flex-col pt-24">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-3 rounded-full hover:bg-zinc-800/80 transition-colors text-zinc-400 hover:text-zinc-100 mt-1"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-amber-400" />
                                All Achievements
                            </h1>
                            <p className="text-zinc-400 mt-1 text-sm">
                                You have unlocked {unlockedCount} out of {totalCount} trophies!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ACHIEVEMENTS.map((ach) => {
                            const unlocked = ach.isUnlocked(user);
                            const prog = ach.progress(user);
                            const percent = Math.min(100, (prog.current / prog.max) * 100);

                            return (
                                <div
                                    key={ach.id}
                                    className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${unlocked
                                            ? 'bg-zinc-800/40 border-amber-500/30 shadow-[0_0_15px_-3px_rgba(251,191,36,0.1)]'
                                            : 'bg-zinc-900/50 border-zinc-800/50 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-3 rounded-xl shrink-0 ${unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                            {unlocked ? <ach.icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                        </div>
                                        <div className="flex flex-col flex-1 mt-0.5">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <span className={`text-base font-bold leading-tight ${unlocked ? 'text-zinc-100' : 'text-zinc-400'}`}>
                                                    {ach.title}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500 font-mono">
                                                {Math.floor(prog.current).toLocaleString()} / {prog.max.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={`text-xs leading-relaxed mt-1 flex-1 ${unlocked ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                        {ach.description}
                                    </p>

                                    {!unlocked && (
                                        <div className="mt-3 h-1.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
                                            <div
                                                className="h-full bg-zinc-500 rounded-full"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
