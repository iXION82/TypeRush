import { useEffect, useState } from "react";

export function TypingBox() {
    const text = "The quick brown fox jumps over the lazy dog...";
    const words = text.split(" ");

    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
    const [typedWords, setTypedWords] = useState<string[]>([]);

    const getWordClass = (wordIdx: number) => {
        if (wordIdx < currentWordIdx) return "opacity-60";
        if (wordIdx === currentWordIdx) return "opacity-100";
        return "opacity-40";
    };

    const getLetterClass = (
        word: string,
        wordIdx: number,
        letterIdx: number
    ) => {
        const typed = typedWords[wordIdx]?.[letterIdx];

        if (wordIdx < currentWordIdx) {
            return typed === word[letterIdx]
                ? "text-green-400"
                : "text-red-400";
        }

        if (wordIdx === currentWordIdx) {
            if (letterIdx === currentLetterIdx)
                return "text-amber-400";
            if (typed == null) return "text-zinc-400";
            return typed === word[letterIdx]
                ? "text-green-400"
                : "text-red-400";
        }

        return "text-zinc-400";
    };
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") {
                return;
            }

            const currentWord = words[currentWordIdx];
            const currentTyped = typedWords[currentWordIdx] || "";
            if (e.key === "Backspace") {
                if (currentLetterIdx > 0) {
                    const updated = [...typedWords];
                    updated[currentWordIdx] = currentTyped.slice(0, -1);
                    setTypedWords(updated);
                    setCurrentLetterIdx((i) => i - 1);
                }
                return;
            }
            if (e.key === " ") {
                if (currentLetterIdx === 0) return;
                setCurrentWordIdx((i) => i + 1);
                setCurrentLetterIdx(0);
                return;
            }
            if (currentLetterIdx < currentWord.length) {
                const updated = [...typedWords];
                updated[currentWordIdx] = currentTyped + e.key;
                setTypedWords(updated);
                setCurrentLetterIdx((i) => i + 1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentLetterIdx, currentWordIdx, typedWords, words]);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="mb-6 flex gap-4">
                {["Time", "Words", "Zen"].map((item) => (
                    <button
                        key={item}
                        className="px-4 py-2 rounded-full text-sm text-zinc-300 bg-zinc-800/60 hover:bg-zinc-700/60 hover:text-amber-400 transition"
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div className="relative w-full max-w-4xl min-h-[30vh] rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/40 shadow-2xl p-8 text-lg leading-relaxed font-mono">
                <div className="flex flex-wrap gap-x-2 gap-y-1 select-none">
                    {words.map((word, wordIdx) => (
                        <div
                            key={wordIdx}
                            className={`flex ${getWordClass(wordIdx)}`}
                        >
                            {word.split("").map((letter, letterIdx) => (
                                <span
                                    key={letterIdx}
                                    className={getLetterClass(
                                        word,
                                        wordIdx,
                                        letterIdx
                                    )}
                                >
                                    {letter}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>

                <span
                    className="absolute bottom-6 left-8 w-0.5 h-6 bg-amber-500 animate-pulse"
                />
            </div>
        </div>
    );
}
