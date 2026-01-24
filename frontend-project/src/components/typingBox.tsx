import { useEffect, useRef, useState } from "react";

export function TypingBox() {
    const text = "The quick brown fox jumps over the lazy dog...";
    const words = text.split(" ");

    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
    const [typedWords, setTypedWords] = useState<string[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const letterRefs = useRef<HTMLSpanElement[][]>([]);
    const caretRef = useRef<HTMLSpanElement>(null);

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
        const caret = caretRef.current;
        const container = containerRef.current;
        const letter =
            letterRefs.current[currentWordIdx]?.[currentLetterIdx];

        if (!caret || !container || !letter) return;

        const letterRect = letter.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        caret.style.transform = `translate(
            ${letterRect.left - containerRect.left}px,
            ${letterRect.top - containerRect.top}px
        )`;
    }, [currentWordIdx, currentLetterIdx]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

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
            <div className="relative w-full max-w-4xl">
                <div
                    ref={containerRef}
                    className="relative min-h-[30vh] rounded-2xl bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/40 shadow-2xl p-8 text-lg leading-relaxed font-mono"
                >
                    <div className="flex flex-wrap gap-x-2 gap-y-1 select-none">
                        {words.map((word, wordIdx) => (
                            <div
                                key={wordIdx}
                                className={`flex ${getWordClass(wordIdx)}`}
                            >
                                {word.split("").map((letter, letterIdx) => {
                                    return (
                                        <span
                                            key={letterIdx}
                                            ref={(el) => {
                                                if (!el) return;
                                                if (!letterRefs.current[wordIdx]) {
                                                    letterRefs.current[wordIdx] = [];
                                                }
                                                letterRefs.current[wordIdx][letterIdx] = el;
                                            }}
                                            className={`${getLetterClass(
                                                word,
                                                wordIdx,
                                                letterIdx
                                            )} transition-colors duration-150`}
                                        >
                                            {letter}
                                        </span>

                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* CARET */}
                    <span
                        ref={caretRef}
                        className="absolute w-0.5 h-6 bg-amber-500 rounded animate-pulse
                                   transition-transform duration-150 ease-out"
                    />
                </div>
            </div>
        </div>
    );
}
