import { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

interface KeystrokeReplayProps {
    text: string;
    keystrokes: { key: string; timestamp: number; correct: boolean }[];
}

export function KeystrokeReplay({ text, keystrokes }: KeystrokeReplayProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedChars, setTypedChars] = useState<{ char: string; correct: boolean }[]>([]);
    
    const timeoutRefs = useRef<number[]>([]);

    const stopPlayback = () => {
        setIsPlaying(false);
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
    };

    const resetReplay = () => {
        stopPlayback();
        setCurrentIndex(0);
        setTypedChars([]);
    };

    const startReplay = () => {
        if (keystrokes.length === 0) return;
        
        resetReplay();
        setIsPlaying(true);
        
        const startTime = keystrokes[0].timestamp;
        
        keystrokes.forEach((stroke, idx) => {
            const delay = stroke.timestamp - startTime;
            
            const timeoutId = window.setTimeout(() => {
                setTypedChars(prev => [...prev, { char: stroke.key, correct: stroke.correct }]);
                setCurrentIndex(idx + 1);
                
                if (idx === keystrokes.length - 1) {
                    setIsPlaying(false);
                }
            }, delay);
            
            timeoutRefs.current.push(timeoutId);
        });
    };

    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(clearTimeout);
        };
    }, []);

    // Simplified rendering for replay
    return (
        <div className="w-full mt-6 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm uppercase tracking-widest text-zinc-400">Keystroke Replay</h3>
                
                <div className="flex gap-2">
                    {!isPlaying ? (
                        <button onClick={startReplay} className="p-2 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition-colors" title="Play">
                            <Play size={18} fill="currentColor" />
                        </button>
                    ) : (
                        <button onClick={stopPlayback} className="p-2 rounded bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors" title="Stop">
                            <Square size={18} fill="currentColor" />
                        </button>
                    )}
                    <button onClick={resetReplay} className="p-2 rounded bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 transition-colors" title="Reset">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            <div className="font-mono text-lg leading-relaxed max-h-64 overflow-y-auto p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/50">
                {typedChars.map((stroke, i) => (
                    <span 
                        key={i} 
                        className={stroke.correct ? 'text-green-400' : 'text-red-400'}
                    >
                        {stroke.char === ' ' ? '\u00A0' : stroke.char}
                    </span>
                ))}
                
                {isPlaying && (
                    <span className="inline-block w-2 h-[1em] bg-amber-500 animate-pulse ml-0.5 align-middle"></span>
                )}
                
                {/* Show remaining untyped text faintly */}
                {typedChars.length < text.length && (
                    <span className="text-zinc-600 opacity-50">
                        {text.slice(typedChars.length)}
                    </span>
                )}
            </div>
            
            <div className="mt-4 flex justify-between text-xs text-zinc-500">
                <span>Progress: {currentIndex} / {keystrokes.length} keystrokes</span>
            </div>
        </div>
    );
}
