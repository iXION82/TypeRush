import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Type, Gamepad2, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAvatarPath } from '../context/SettingsContext';
import { getLevelData } from '../utils/levelUtils';
import { Navbar } from '../components/navbar';

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // If suddenly logged out, navigate away or show nothing
    if (!user) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 text-center">
                        <p className="text-zinc-400">Please log in to view your profile.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    };

    const formatCategoryName = (category: string) => {
        const parts = category.split('-');
        if (parts.length < 2) return category;

        const mode = parts[0] === 'time' ? 'Time' : 'Words';
        const amount = parts[0] === 'time' ? `${parts[1]}s` : `${parts[1]}w`;

        const hasPunc = parts.includes('puncTrue');
        const hasNums = parts.includes('numTrue');

        let mods = '';
        if (hasPunc && hasNums) mods = ' (Punctuation & Numbers)';
        else if (hasPunc) mods = ' (Punctuation)';
        else if (hasNums) mods = ' (Numbers)';

        return `${mode} ${amount}${mods}`;
    };

    const bestScoresList = user.bestScores
        ? Object.entries(user.bestScores).sort((a, b) => b[1] - a[1])
        : [];

    return (
        <div className="min-h-screen bg-transparent flex flex-col font-mono text-zinc-100">
            <Navbar />

            <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col gap-6 fade-in duration-300">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="self-start flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors py-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Return
                </button>

                {/* Profile Header Card */}
                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-32 h-32 rounded-full border-4 border-amber-500/30 overflow-hidden flex-shrink-0 shadow-lg shadow-amber-500/20">
                            <img
                                src={getAvatarPath(user.avaPic || 1)}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 min-w-0">
                            <h2 className="text-4xl font-bold text-zinc-100 tracking-tight">{user.name}</h2>
                            <p className="text-zinc-500 mb-6">{user.email}</p>

                            <div className="w-full max-w-md">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="
                                        px-3 py-1 rounded-lg
                                        bg-amber-500/10 border border-amber-500/20
                                        text-amber-400 text-sm font-bold
                                        flex items-center gap-1.5
                                    ">
                                        <Star className="w-4 h-4" />
                                        Level {user.level}
                                    </div>
                                    <span className="text-zinc-400 text-xs font-medium tracking-wide">
                                        {getLevelData(user.exp).currentLevelExp.toLocaleString()} / {getLevelData(user.exp).expForNextLevel.toLocaleString()} XP
                                    </span>
                                </div>
                                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
                                    <div
                                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                                        style={{ width: `${(getLevelData(user.exp).progress * 100).toFixed(1)}%`, boxShadow: '0 0 10px rgba(251,191,36,0.6)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Lifetime Stats & Achievements */}
                    <div className="lg:col-span-1 flex flex-col gap-6">

                        {/* Lifetime Stats Card */}
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6">
                            <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2 mb-6">
                                <Target className="w-4 h-4 text-emerald-400" /> Lifetime Stats
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-violet-500/10 rounded-lg"><Gamepad2 className="w-5 h-5 text-violet-400" /></div>
                                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Games</span>
                                    </div>
                                    <p className="text-xl font-bold text-zinc-100">{user.gamesPlayed.toLocaleString()}</p>
                                </div>
                                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg"><Type className="w-5 h-5 text-emerald-400" /></div>
                                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Chars</span>
                                    </div>
                                    <p className="text-xl font-bold text-zinc-100">{user.totalCharsTyped.toLocaleString()}</p>
                                </div>
                                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-sky-500/10 rounded-lg"><Clock className="w-5 h-5 text-sky-400" /></div>
                                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Time</span>
                                    </div>
                                    <p className="text-xl font-bold text-zinc-100">{formatTime(user.totalTimeTyped)}</p>
                                </div>
                                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-lg"><Star className="w-5 h-5 text-amber-400" /></div>
                                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Total XP</span>
                                    </div>
                                    <p className="text-xl font-bold text-amber-500">{user.exp.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Achievements Space (Prepared for future expansion) */}
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 flex flex-col">
                            <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2 mb-4">
                                <Trophy className="w-4 h-4 text-amber-400" /> Achievements
                            </h3>
                            <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-60">
                                <Trophy className="w-12 h-12 text-zinc-600 mb-3" />
                                <p className="text-sm text-zinc-500 text-center">Achievements system<br />coming soon.</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Category Bests */}
                    <div className="lg:col-span-2 relative">
                        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 sm:p-8 h-full">
                            <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2 mb-6">
                                <Star className="w-4 h-4 text-amber-400" /> Category Personal Bests
                            </h3>

                            {bestScoresList.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {bestScoresList.map(([category, score]) => (
                                        <div
                                            key={category}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all duration-300 group"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">
                                                    {formatCategoryName(category)}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 font-mono mt-1 opacity-60">
                                                    {category}
                                                </span>
                                            </div>
                                            <div className="flex items-baseline gap-1.5 px-3 py-1.5 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                                <span className="text-xl font-bold text-amber-400">{score.toLocaleString()}</span>
                                                <span className="text-[10px] uppercase text-zinc-500 font-bold">Pts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-zinc-800/20 border border-zinc-800 border-dashed rounded-3xl">
                                    <Star className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-400 text-lg mb-2 font-semibold">No personal bests recorded yet.</p>
                                    <p className="text-sm text-zinc-500 max-w-sm mx-auto">Complete typing tests to set records and fill your trophy cabinet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
