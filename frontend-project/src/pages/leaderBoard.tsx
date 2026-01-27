import { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, Target, User } from 'lucide-react';

interface Score {
    id: string;
    username: string;
    wpm: number;
    accuracy: number;
    date: string;
}

const LeaderboardPage = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            const mockData: Score[] = [
                { id: '1', username: 'keyboard_wizard', wpm: 156, accuracy: 100, date: '2023-10-12' },
                { id: '2', username: 'null_pointer', wpm: 142, accuracy: 98.5, date: '2023-11-05' },
                { id: '3', username: 'sudo_user', wpm: 138, accuracy: 99.2, date: '2023-09-28' },
                { id: '4', username: 'vim_enthusiast', wpm: 125, accuracy: 96.0, date: '2023-12-01' },
                { id: '5', username: 'qwerty_hero', wpm: 118, accuracy: 97.5, date: '2023-10-30' },
                { id: '6', username: 'ctrl_alt_del', wpm: 112, accuracy: 94.8, date: '2023-11-15' },
                { id: '7', username: 'fast_fingers', wpm: 105, accuracy: 98.0, date: '2023-10-05' },
                { id: '8', username: 'code_monkey', wpm: 98, accuracy: 95.5, date: '2023-11-20' },
                { id: '9', username: 'pixel_pusher', wpm: 92, accuracy: 99.0, date: '2023-09-15' },
                { id: '10', username: 'junior_dev', wpm: 88, accuracy: 92.5, date: '2023-12-10' },
            ];
            setTimeout(() => {
                setScores(mockData);  
                setIsLoading(false);
            }, 1000);
        };

        fetchScores();
    }, []);

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
        <div className="flex items-center justify-center w-full min-h-screen bg-black/50 p-4 font-mono">
            <div className="
                w-full 
                max-w-3xl 
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
                        <p className="text-zinc-500 text-sm mt-1">Top 10 all-time best scores</p>
                    </div>

                    <div className="hidden sm:flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">All Time</span>
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
                            <div className="col-span-5 md:col-span-4 pl-2">User</div>
                            <div className="col-span-3 text-right">WPM</div>
                            <div className="col-span-3 md:col-span-2 text-right">Acc</div>
                            <div className="hidden md:block col-span-2 text-right">Date</div>
                        </div>

                        {scores.slice(0, 10).map((score, index) => {
                            const style = getRankStyle(index);
                            
                            return (
                                <div 
                                    key={score.id}
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

                                    <div className="col-span-5 md:col-span-4 flex items-center gap-3 pl-2 overflow-hidden">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-400`}>
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className={`truncate font-semibold ${index === 0 ? 'text-amber-100' : 'text-zinc-300'}`}>
                                            {score.username}
                                        </span>
                                        {index === 0 && <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-black font-bold">KING</span>}
                                    </div>

                                    <div className="col-span-3 text-right font-bold text-xl text-zinc-100 flex items-center justify-end gap-1">
                                        {score.wpm}
                                        <span className="text-[10px] text-zinc-500 font-normal mt-1">WPM</span>
                                    </div>

                                    <div className="col-span-3 md:col-span-2 text-right text-zinc-400 flex items-center justify-end gap-1">
                                        <Target className="w-3 h-3 mb-0.5 opacity-50" />
                                        {score.accuracy}%
                                    </div>

                                    <div className="hidden md:block col-span-2 text-right text-sm text-zinc-600">
                                        {formatDate(score.date)}
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
                        <p className="text-sm">Be the first to claim the throne.</p>
                        
                        <button className="mt-6 px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-all border border-zinc-700">
                            Start Typing Test
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;