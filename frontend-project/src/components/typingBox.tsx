import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function TypingBox() {
    const text = "The silent moon watched curious cats wander across narrow streets while distant clocks ticked softly and warm lights flickered through old windows as travelers paused briefly to listen breathe and move forward without knowing where the night might gently lead them next";
    const words = text.split(" ");

    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
    const [typedWords, setTypedWords] = useState<string[]>([]);

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
            return typed === word[letterIdx] ? "text-green-400" : "text-red-400";
        }

        if (wordIdx === currentWordIdx) {
            if (letterIdx === currentLetterIdx) return "text-amber-400";
            if (typed == null) return "text-zinc-400";
            return typed === word[letterIdx] ? "text-green-400" : "text-red-400";
        }

        return "text-zinc-400";
    };

    useLayoutEffect(() => {
        const caret = caretRef.current;
        if (!caret) return;

        const letters = letterRefs.current[currentWordIdx];
        if (!letters) return;

        const prevLetter = letters[currentLetterIdx - 1];
        const currentLetter = letters[currentLetterIdx];

        let x = 0;
        let y = 0;

        if (prevLetter) {
            x = prevLetter.offsetLeft + prevLetter.offsetWidth;
            y = prevLetter.offsetTop + prevLetter.offsetHeight - caret.offsetHeight;
        } else if (currentLetter) {
            x = currentLetter.offsetLeft;
            y = currentLetter.offsetTop + currentLetter.offsetHeight - caret.offsetHeight;
        } else if (letters[0]) {
            x = letters[0].offsetLeft;
            y = letters[0].offsetTop + letters[0].offsetHeight - caret.offsetHeight;
        }

        caret.style.transform = `translate(${x}px, ${y}px)`;
    }, [currentWordIdx, currentLetterIdx, typedWords]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;

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
                if (currentLetterIdx === 0 && currentTyped === "") return;
                setCurrentWordIdx((i) => i + 1);
                setCurrentLetterIdx(0);
                return;
            }

            const updated = [...typedWords];
            updated[currentWordIdx] = currentTyped + e.key;
            setTypedWords(updated);
            setCurrentLetterIdx((i) => i + 1);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentLetterIdx, currentWordIdx, typedWords]);

    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-5xl">
                <div
                    className="
                        min-h-50
                        rounded-3xl
                        bg-zinc-900/70
                        backdrop-blur-xl
                        border border-zinc-700/40
                        shadow-2xl
                        px-10
                        py-8
                        text-xl
                        leading-relaxed
                        font-mono
                        overflow-hidden
                        cursor-default">
                    <div className="relative select-none leading-relaxed wrap-break-word">
                        <span
                            ref={caretRef}
                                className="
                                    absolute
                                    w-0.5
                                    h-[1em]
                                    bg-amber-500
                                    rounded
                                    animate-pulse
                                    transition-all
                                    duration-75
                                    ease-out
                                    z-10"/>

                        {words.map((word, wordIdx) => {
                            const typed = typedWords[wordIdx] || "";
                            const extraLetters = typed.slice(word.length);

                            return (
                                <span
                                    key={wordIdx}
                                    className={`inline-block mr-3 mb-2 ${getWordClass(wordIdx)}`}>
                                    {word.split("").map((letter, letterIdx) => (
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
                                    ))}
                                    {extraLetters.split("").map((letter, i) => (
                                        <span
                                            key={`extra-${i}`}
                                            ref={(el) => {
                                                if (!el) return;
                                                if (!letterRefs.current[wordIdx]) {
                                                    letterRefs.current[wordIdx] = [];
                                                }
                                                letterRefs.current[wordIdx][word.length + i] = el;
                                            }}
                                            className="text-red-400 opacity-80 transition-colors duration-150 border-b-2 border-red-500/50">
                                            {letter}
                                        </span>
                                    ))}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
