import { useMemo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { TypingNavbar } from "./typingNavbar";

type Mode = "time" | "words" | "zen";

type Level = 1 | 2 | 3 | null;

type State = "idle" | "playing" | "end";
export function TypingBox() {
    const text = "The quiet river reflected broken stars as bicycles whispered past sleeping shops and paper signs curled in doorways while a baker laughed alone birds shifted on wires and a stray dog followed footsteps patiently believing dawn would arrive soon carrying bread warmth stories and the soft courage needed to begin again without maps promises or fear under pale skies where minutes stretched kindly listeners learned to breathe slowly walk lightly trust silence memory chance rhythm time forward together tonight softly";
    const words = useMemo(() => text.split(" "), []);

    const [currentWordIdx, setCurrentWordIdx] = useState(0);
    const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
    const [typedWords, setTypedWords] = useState<string[]>([]);
    const [state, setState] = useState<State>("idle");
    const [stats, setStats] = useState({
        correctChar: 0,
        incorrectChar: 0
    })

    const [mode, setMode] = useState<Mode>("time");
    const [timer, setTimer] = useState(5);
    const [punctuation, setPunctuation] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [level, setLevel] = useState<Level>(2);

    const letterRefs = useRef<HTMLSpanElement[][]>([]);
    const caretRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
        const container = containerRef.current;
        if (!caret || !container) return;
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

        caret.style.transform = `translate(${x - 1}px, ${y - 1}px)`;
        const visibleHeight = container.clientHeight;
        const caretHeight = caret.offsetHeight;
        const targetScroll = y - (visibleHeight / 2) + (caretHeight / 2);
        container.scrollTo({
            top: targetScroll > 0 ? targetScroll : 0,
            behavior: "smooth"
        });

    }, [currentWordIdx, currentLetterIdx, typedWords]);

    const startGameTimer = () => {

        if (level === 1) {
            setTimer(30);
        } else if (level === 2) {
            setTimer(60);
        } else if (level == 3) {
            setTimer(120);
        } else {
            return;
        }
        setState("playing");
        const clock = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(clock);
                    setState("end");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const startGameWords = () => {

        setTimer(0);
        let wordlimit = 25;
        if (level === 1) {
            wordlimit = 25;
        } else if (level === 2) {
            wordlimit = 50;
        } else if (level == 3) {
            wordlimit = 100;
        } else {
            return;
        }
        setState("playing");

        const clock = setInterval(() => {
            setTimer(prev => {
                if (typedWords.length >= wordlimit) {
                    clearInterval(clock);
                    setState("end");
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);
    };


    const restartGame = () => {
        setState("idle");
        setCurrentWordIdx(0);
        setCurrentLetterIdx(0);
        setTypedWords([]);
        setStats({
            correctChar: 0,
            incorrectChar: 0
        });
        setTimer(5);
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") return;
            console.log(mode);
            if (state === "idle") {
                if (mode === "time") {
                    startGameTimer();
                } else if (mode === "words") {
                    console.log("hello");
                    startGameWords();
                }

            } else if (state === "end") return;

            const currentTyped = typedWords[currentWordIdx] || "";
            const currentTargetWord = words[currentWordIdx];

            if (e.key === "Backspace") {
                if (currentLetterIdx > 0) {
                    const charDeleted = currentTyped[currentTyped.length - 1];
                    const charExpected = currentTargetWord[currentLetterIdx - 1];

                    if (charDeleted === charExpected) {
                        setStats((prev) => ({
                            ...prev,
                            correctChar: Math.max(0, prev.correctChar - 1),
                        }));
                    }

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

            const charExpected = currentTargetWord[currentLetterIdx];

            if (charExpected && e.key === charExpected) {
                setStats((prev) => ({ ...prev, correctChar: prev.correctChar + 1 }));
            } else {
                setStats((prev) => ({ ...prev, incorrectChar: prev.incorrectChar + 1 }));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentLetterIdx, currentWordIdx, typedWords, words, state, mode, level]);

    const calculateAccuracy = () => {
        const total = stats.correctChar + stats.incorrectChar;
        if (total === 0) return 100;

        return ((stats.correctChar / total) * 100).toFixed(2);
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-5xl">
                <TypingNavbar
                    timer={timer}
                    setTimer={setTimer}
                    punctuation={punctuation}
                    setPunctuation={setPunctuation}
                    numbers={numbers}
                    setNumbers={setNumbers}
                    mode={mode}
                    setMode={setMode}
                    level={level}
                    setLevel={setLevel}
                />
                <div
                    ref={containerRef}
                    className="
                        h-70
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
                        cursor-default
                        relative
                    ">
                    {state === "end" ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <div>
                                <div>
                                    <div>Accuracy{calculateAccuracy()}</div>
                                    <div>Score:100</div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => { restartGame() }}
                                    >Restart Game</button>
                                </div>
                            </div>
                        </div>

                    ) : (<div className="relative select-none leading-relaxed wrap-break-word">
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
                                z-10"
                        />

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
                                            )} transition-colors duration-150`}>
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
                    </div>)}

                </div>
                <div>
                    Accuracy{calculateAccuracy()}
                </div>
            </div>
        </div>
    );
}