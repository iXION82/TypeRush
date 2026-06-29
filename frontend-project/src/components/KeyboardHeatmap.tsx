import { useMemo } from 'react';

export interface KeyStats {
    correct: number;
    missed: number;
}

interface KeyboardHeatmapProps {
    keyStats: Record<string, KeyStats>;
}

const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

export function KeyboardHeatmap({ keyStats }: KeyboardHeatmapProps) {
    const { maxMisses, maxCorrect } = useMemo(() => {
        const stats = Object.values(keyStats);
        return {
            maxMisses: stats.length > 0 ? Math.max(...stats.map(s => s.missed)) : 0,
            maxCorrect: stats.length > 0 ? Math.max(...stats.map(s => s.correct)) : 0
        };
    }, [keyStats]);

    const getKeyColor = (key: string) => {
        const stat = keyStats[key];
        if (!stat || (stat.correct === 0 && stat.missed === 0)) {
            return 'bg-zinc-800 text-zinc-400 border-zinc-700/50';
        }
        
        if (stat.missed > 0) {
            // Calculate red intensity based on maxMisses
            const intensity = maxMisses > 0 ? stat.missed / maxMisses : 0;
            if (intensity < 0.3) return 'bg-red-900/40 text-red-200 border-red-800/50';
            if (intensity < 0.6) return 'bg-red-700/60 text-red-100 border-red-600/50';
            return 'bg-red-500 text-white border-red-400';
        } else {
            // Calculate green intensity based on maxCorrect
            const intensity = maxCorrect > 0 ? stat.correct / maxCorrect : 0;
            if (intensity < 0.3) return 'bg-emerald-900/40 text-emerald-200 border-emerald-800/50';
            if (intensity < 0.6) return 'bg-emerald-700/60 text-emerald-100 border-emerald-600/50';
            return 'bg-emerald-500 text-white border-emerald-400';
        }
    };

    if (Object.keys(keyStats).length === 0) {
        return (
            <div className="w-full mt-6 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-6 text-center">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Key Heatmap</h3>
                <p className="text-zinc-500">No keys pressed yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full mt-6 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400">Key Heatmap</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                        <span>Misses</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-red-900/40"></div>
                            <div className="w-3 h-3 rounded-sm bg-red-700/60"></div>
                            <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Correct</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-emerald-900/40"></div>
                            <div className="w-3 h-3 rounded-sm bg-emerald-700/60"></div>
                            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                    <div 
                        key={rowIdx} 
                        className="flex gap-1 sm:gap-2"
                        style={{ marginLeft: rowIdx * (window.innerWidth < 640 ? 10 : 20) + 'px' }}
                    >
                        {row.map(key => {
                            const stat = keyStats[key];
                            return (
                                <div 
                                    key={key}
                                    className={`
                                        w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center 
                                        rounded-lg border text-sm sm:text-base font-mono uppercase
                                        transition-colors duration-300 relative group
                                        ${getKeyColor(key)}
                                    `}
                                >
                                    {key}
                                    
                                    {stat && (stat.correct > 0 || stat.missed > 0) && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-zinc-700 flex flex-col items-center">
                                            {stat.missed > 0 && <span className="text-red-400">Missed: {stat.missed}</span>}
                                            {stat.correct > 0 && <span className="text-emerald-400">Correct: {stat.correct}</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
