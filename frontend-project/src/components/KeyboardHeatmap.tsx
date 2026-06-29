import { useMemo } from 'react';

interface KeyboardHeatmapProps {
    missedKeys: Record<string, number>;
}

const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

export function KeyboardHeatmap({ missedKeys }: KeyboardHeatmapProps) {
    const maxMisses = useMemo(() => {
        const values = Object.values(missedKeys);
        return values.length > 0 ? Math.max(...values) : 0;
    }, [missedKeys]);

    const getKeyColor = (key: string) => {
        const count = missedKeys[key] || 0;
        if (count === 0) return 'bg-zinc-800 text-zinc-400 border-zinc-700/50';
        
        // Calculate intensity based on maxMisses
        const intensity = maxMisses > 0 ? count / maxMisses : 0;
        
        // Return progressively redder shades
        if (intensity < 0.3) return 'bg-red-900/40 text-red-200 border-red-800/50';
        if (intensity < 0.6) return 'bg-red-700/60 text-red-100 border-red-600/50';
        return 'bg-red-500 text-white border-red-400';
    };

    if (maxMisses === 0) {
        return (
            <div className="w-full mt-6 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-6 text-center">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Key Heatmap</h3>
                <p className="text-zinc-500">No missed keys! Perfect typing.</p>
            </div>
        );
    }

    return (
        <div className="w-full mt-6 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-6">
            <div className="flex justify-between items-end mb-6">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400">Missed Keys Heatmap</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>Few</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-red-900/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-red-700/60"></div>
                        <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                    </div>
                    <span>Many</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                    <div 
                        key={rowIdx} 
                        className="flex gap-2"
                        style={{ marginLeft: rowIdx * 20 + 'px' }}
                    >
                        {row.map(key => (
                            <div 
                                key={key}
                                className={`
                                    w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center 
                                    rounded-lg border text-sm sm:text-base font-mono uppercase
                                    transition-colors duration-300 relative group
                                    ${getKeyColor(key)}
                                `}
                            >
                                {key}
                                
                                {missedKeys[key] > 0 && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-zinc-700">
                                        Missed {missedKeys[key]}x
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
