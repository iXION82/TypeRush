import { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, Target, Clock, Hash, AlignLeft, AtSign } from 'lucide-react';
import { Navbar } from '../components/navbar';
import api from '../api/api';
import { getAvatarPath } from '../context/SettingsContext';

interface LeaderboardScore {
    _id: string;
    scoreId: {
        _id: string;
        accuracy: number;
        netWPM: number;
        createdAt: string;
    };
    scoreValue: number;
    userId: {
        _id: string;
        name: string;
        avaPic: number;
    };
}

type Mode = 'time' | 'words';
type Level = 1 | 2 | 3;

const LeaderboardPage = () => {
    const [scores, setScores] = useState<LeaderboardScore[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [mode, setMode] = useState<Mode>('time');
    const [level, setLevel] = useState<Level>(2);
    const [punctuation, setPunctuation] = useState(false);
    const [numbers, setNumbers] = useState(false);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            const gameLength = mode === 'time'
                ? (level === 1 ? 30 : level === 2 ? 60 : 120)
                : (level === 1 ? 25 : level === 2 ? 50 : 100);
            const gameModeStr = `${mode}-${gameLength}`;
            const category = `${gameModeStr}-${punctuation ? 'puncTrue' : 'puncFalse'}-${numbers ? 'numTrue' : 'numFalse'}`;

            try {
                const res = await api.get(`/score/leaderboard?category=${category}`);
                setScores(res.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                setScores([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [mode, level, punctuation, numbers]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getRankStyle = (index: number) => {
        if (index === 0) return { icon: <Trophy className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
        if (index === 1) return { icon: <Medal className="w-5 h-5" />, color: "text-zinc-300", bg: "bg-zinc-500/10 border-zinc-500/20" };
        if (index === 2) return { icon: <Medal className="w-5 h-5" />, color: "text-amber-700", bg: "bg-amber-900/10 border-amber-900/20" };
        return { icon: <span className="font-mono font-bold">#{index + 1}</span>, color: "text-zinc-500", bg: "bg-transparent border-transparent" };
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-gray-200">
            <Navbar />
            <main className="flex-1 flex flex-col items-center p-4 font-mono">
                { }
                <div className="w-full max-w-4xl mb-6 bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-800 p-4">
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">

                        { }
                        <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
                            <button
                                onClick={() => setMode('time')}
                                className={`px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors ${mode === 'time' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                <Clock className="w-4 h-4" /> Time
                            </button>
                            <button
                                onClick={() => setMode('words')}
                                className={`px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors ${mode === 'words' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                <AlignLeft className="w-4 h-4" /> Words
                            </button>
                        </div>

                        { }
                        <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
                            <button
                                onClick={() => setLevel(1)}
                                className={`px-4 py-1.5 rounded-md transition-colors ${level === 1 ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                {mode === 'time' ? '30s' : '25w'}
                            </button>
                            <button
                                onClick={() => setLevel(2)}
                                className={`px-4 py-1.5 rounded-md transition-colors ${level === 2 ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                {mode === 'time' ? '60s' : '50w'}
                            </button>
                            <button
                                onClick={() => setLevel(3)}
                                className={`px-4 py-1.5 rounded-md transition-colors ${level === 3 ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                {mode === 'time' ? '120s' : '100w'}
                            </button>
                        </div>

                        { }
                        <div className="flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700/50">
                            <button
                                onClick={() => setPunctuation(!punctuation)}
                                className={`px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors ${punctuation ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                <AtSign className="w-4 h-4" /> Punc
                            </button>
                            <button
                                onClick={() => setNumbers(!numbers)}
                                className={`px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors ${numbers ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
                            >
                                <Hash className="w-4 h-4" /> Nums
                            </button>
                        </div>

                    </div>
                </div>

                { }
                <div className="
                w-full 
                max-w-4xl 
                rounded-3xl 
                bg-zinc-900/70 
                backdrop-blur-xl 
                border border-zinc-700/40 
                shadow-2xl 
                p-8 
                sm:p-10
                relative
                overflow-hidden">

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
                                <Trophy className="text-amber-400 w-6 h-6" />
                                Leaderboard
                            </h1>
                            <p className="text-zinc-500 text-sm mt-1">Top 10 all-time best scores for this category</p>
                        </div>

                        <div className="hidden sm:flex flex-col items-end gap-1">
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                                {mode.toUpperCase()} • {mode === 'time' ? (level === 1 ? '30s' : level === 2 ? '60s' : '120s') : (level === 1 ? '25w' : level === 2 ? '50w' : '100w')}
                            </span>
                            {(punctuation || numbers) && (
                                <span className="text-[10px] text-zinc-500 font-bold tracking-wider">
                                    {punctuation && 'PUNC '}{numbers && 'NUMS'}
                                </span>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 w-full bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : scores && scores.length > 0 ? (
                        <div className="space-y-3 relative z-10">

                            <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-zinc-500 px-4 pb-2">
                                <div className="col-span-1 text-center">Rank</div>
                                <div className="col-span-4 pl-2">User</div>
                                <div className="col-span-3 text-right">Score</div>
                                <div className="col-span-2 text-right">WPM / Acc</div>
                                <div className="hidden md:block col-span-2 text-right">Date</div>
                            </div>

                            {scores.map((score, index) => {
                                const style = getRankStyle(index);

                                return (
                                    <div
                                        key={score._id || index}
                                        className={`
                                        grid grid-cols-12 items-center 
                                        p-4 rounded-xl 
                                        border ${style.bg === "bg-transparent border-transparent" ? "border-zinc-800/50 bg-zinc-800/30" : style.bg}
                                        hover:bg-zinc-700/30 
                                        transition-all duration-200
                                        group
                                    `}
                                    >
                                        <div className={`col-span-1 flex justify-center items-center ${style.color}`}>
                                            {style.icon}
                                        </div>

                                        <div className="col-span-4 flex items-center gap-3 pl-2 overflow-hidden">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 shrink-0 shadow-sm">
                                                <img
                                                    src={getAvatarPath(score.userId?.avaPic || 1)}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className={`truncate font-semibold ${index === 0 ? 'text-amber-100' : 'text-zinc-300'}`}>
                                                {score.userId?.name || 'Unknown'}
                                            </span>
                                        </div>

                                        { }
                                        <div className="col-span-3 text-right font-bold text-xl text-amber-400 drop-shadow-sm truncate">
                                            {score.scoreValue}
                                        </div>

                                        { }
                                        <div className="col-span-2 text-right text-zinc-300 flex flex-col items-end justify-center">
                                            <div className="flex items-center gap-1 text-sm font-bold">
                                                {score.scoreId?.netWPM ?? 0} <span className="text-[10px] uppercase font-normal text-zinc-500">WPM</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-zinc-400 opacity-80">
                                                <Target className="w-3 h-3" /> {score.scoreId?.accuracy ?? 0}%
                                            </div>
                                        </div>

                                        <div className="hidden md:block col-span-2 text-right text-sm text-zinc-600">
                                            {score.scoreId?.createdAt ? formatDate(score.scoreId.createdAt) : '—'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                <Zap className="w-8 h-8 opacity-20" />
                            </div>
                            <p className="text-lg font-medium text-zinc-400">No scores recorded yet</p>
                            <p className="text-sm">Be the first to claim the throne in this category.</p>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="mt-6 px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-all border border-zinc-700"
                            >
                                Start Typing Test
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LeaderboardPage;